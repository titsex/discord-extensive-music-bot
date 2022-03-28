import { channelRepository, memberRepository, userRepository } from '@database'
import { ACCOUNT_TYPES, ICommand, MContext, Roles } from '@types'
import { buildEmbed } from '@utils'
import { client } from '@index'

export async function extendContext(context: MContext) {
    context.chat = await getChannel(context.guild!.id)
    context.sender = await getUser(context, context.author.id)

    const find = await memberRepository.findOne({ channelId: context.guild!.id, userId: context.sender.id })
    if (!find) await syncChannel(context)

    context.sender.role = (await memberRepository.findOne({
        channelId: context.guild!.id,
        userId: context.sender.id,
    }))!.role
}

export async function validate(context: MContext, command: ICommand | undefined) {
    if (!command && context.channelId === context.chat?.replyChatId) {
        const messages = (await context.channel.messages.fetch()).map(message => message)

        const text = buildEmbed(
            'В этом канале нельзя общаться',
            'Данный текстовый канал предназначен для обращения к боту через его команды'
        )

        await context.channel.messages.delete(context.id)

        if (messages[1].embeds[0]?.title !== text.title) {
            context.channel.send({ embeds: [text] })
            return false
        }
    }

    if (command && context.channelId !== context.chat?.replyChatId && !/bind|activate/i.test(command.aliases[0])) {
        const text = buildEmbed(
            'В этом канале нельзя использовать команды',
            'Команды можно использовать только в привязанном текстовом канале.',
            { name: 'Канал для команд', value: `#${context.chat!.replyChatTitle}`, inline: true }
        )

        context.channel.send({ embeds: [text] })
        return false
    }

    if (command && !context.chat!.activate && command.aliases[0] !== 'activate') {
        const contacts = buildEmbed('Канал не активирован', 'Свяжитесь с разработчиком для его активации', [
            {
                name: 'ВКонтакте',
                value: 'https://vk.com/titsex',
                inline: true,
            },
            {
                name: 'Телеграм',
                value: 'https://t.me/titsex',
                inline: true,
            },
        ])

        await context.channel.send({
            embeds: [contacts],
        })

        return false
    }

    return true
}

export async function getChannel(guildId: string) {
    const find = await channelRepository.findOne(guildId!)
    if (find) return find

    await client.guilds.fetch()

    const guild = await client.guilds.cache.get(guildId)
    const channel = await channelRepository.create()

    channel.members = []
    channel.title = guild!.name
    channel.prefix = '/'
    channel.id = guildId!
    channel.replyChatId = ''
    channel.replyChatTitle = ''
    channel.volume = 50
    channel.activate = false

    const context = {
        guild: guild!,
    }

    await channelRepository.save(channel)
    await getChannelMembers(context as unknown as MContext)

    return await channelRepository.findOne(channel.id)
}

export async function getUser(context: MContext, id?: string) {
    id ||= context.author?.id

    const find = await userRepository.findOne(id)
    if (find) return find

    await context.guild!.members.fetch()

    const user = await userRepository.create()
    const member = context.guild!.members.cache.get(id!)!

    let accountType = ACCOUNT_TYPES.Обычный

    if (process.env.BOT === member.user.id || member.user.bot) accountType = ACCOUNT_TYPES.Бот
    if (process.env.DEVELOPER === member.user.id) accountType = ACCOUNT_TYPES.Разработчик

    user.id = id!
    user.tag = member.user.tag
    user.accountType = accountType
    user.playlists = []

    return await userRepository.save(user)
}

export async function syncChannel(context: MContext) {
    const find = await channelRepository.findOne(context.guild!.id)

    context.chat!.title = context.guild!.name
    find!.title = context.guild!.name

    await getChannelMembers(context)
    await channelRepository.save(find!)
    await syncUsers(context)

    context.chat!.members = (await memberRepository.find({ channelId: context.guild!.id }))!
}

export async function syncUsers(context: MContext) {
    const users = (await memberRepository.find({ channelId: context.guild!.id! })).map(member => member.userId)

    for (const id of users) {
        await syncUser(context, id)
    }
}

export async function syncUser(context: MContext, id: string) {
    await context.guild!.members.fetch()

    const member = await context.guild!.members.cache.get(id)
    const user = (await userRepository.findOne(id))!

    if (member) {
        let accountType = ACCOUNT_TYPES.Обычный

        if (process.env.BOT === member.user.id || member.user.bot) accountType = ACCOUNT_TYPES.Бот
        if (process.env.DEVELOPER === member.user.id) accountType = ACCOUNT_TYPES.Разработчик

        user.tag = member.user.tag
        user.accountType = accountType

        return await userRepository.save(user)
    }
}

export async function getChannelMembers(context: MContext) {
    const memberIds = await context.guild!.members.fetch()

    for (const [memberId] of memberIds) {
        const member = context.guild!.members.cache.get(memberId)!
        const user = await getUser(context, memberId)

        if (!user || !member) continue

        let role = context?.chat?.members?.find(member => member.userId === memberId)?.role || Roles.Пользователь

        if (member.permissions.has('ADMINISTRATOR') || user.accountType === ACCOUNT_TYPES.Золотой)
            role = Roles.Администратор

        if (context.guild!.ownerId === member.user.id) role = Roles.Создатель
        if (user.accountType === ACCOUNT_TYPES.Платиновый) role = Roles['Модератор бота']

        if (member.user.id === process.env.BOT || user.accountType === ACCOUNT_TYPES.Бот || member.user.bot)
            role = Roles.Бот

        if (member.user.id === process.env.DEVELOPER || user.accountType === ACCOUNT_TYPES.Разработчик)
            role = Roles.Разработчик

        const find = await memberRepository.findOne({ channelId: context.guild!.id!, userId: memberId })

        if (find) {
            find.role = role
            await memberRepository.save(find)
        } else
            await memberRepository.save(
                await memberRepository.create({
                    channelId: context.guild!.id!,
                    userId: user.id,
                    role: role,
                })
            )
    }
}
