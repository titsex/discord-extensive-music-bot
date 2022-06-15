import { channelRepository, memberRepository, userRepository } from '@database'
import { ACCOUNT_TYPES, COMMAND_TYPE, ICommand, MContext, Roles } from '@types'
import { buildEmbed } from '@utils'
import { client } from '@index'
import { ChannelEntity } from '@model/Channel.entity'
import { Logger } from '@class/Logger'

export async function extendContext(context: MContext) {
    context.chat = (await getChannel(context.guild!.id)) as ChannelEntity
    context.sender = await getUser(context, context.author.id)

    const find = await memberRepository.findOneBy({ channelId: context.guild!.id, userId: context.sender.id })
    if (!find) await syncChannel(context)

    context.sender.role = (await memberRepository.findOneBy({
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

    if (command && context.channelId !== context.chat?.replyChatId && command.type !== COMMAND_TYPE.EVERY) {
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
    const find = await channelRepository.findOneBy({ id: guildId! })
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
    channel.logs = []

    const context = {
        guild: guild!,
    }

    await channelRepository.save(channel)
    await getChannelMembers(context as unknown as MContext)

    return await channelRepository.findOneBy({ id: channel.id })
}

export async function getUser(context: MContext, id?: string) {
    id ||= context.author?.id

    const find = await userRepository.findOneBy({ id })
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

    return await userRepository.save(user)
}

export async function syncChannel(context: MContext) {
    const find = await channelRepository.findOneBy({ id: context.guild!.id })

    context.chat!.title = context.guild!.name
    find!.title = context.guild!.name

    await getChannelMembers(context)
    await channelRepository.save(find!)
    await syncUsers(context)

    context.chat!.members = (await memberRepository.findBy({ channelId: context.guild!.id }))!
}

export async function syncUsers(context: MContext) {
    const users = (await memberRepository.findBy({ channelId: context.guild!.id! })).map(member => member.userId)

    for (const id of users) {
        await syncUser(context, id)
    }
}

export async function syncUser(context: MContext, id: string) {
    await context.guild!.members.fetch()

    const member = await context.guild!.members.cache.get(id)
    const user = (await userRepository.findOneBy({ id }))!

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

        const find = await memberRepository.findOneBy({ channelId: context.guild!.id!, userId: memberId })

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

export async function setCyberCutletRole(context: MContext) {
    await context.guild?.roles.fetch()

    const role = context.guild!.roles.cache.find(x => x.id === '940848984082247730')

    if (role && !context.member?.roles.cache.some(x => x.id === '940848984082247730'))
        await context.member?.roles.add(role)
}

export async function saveContext(context: MContext) {
    try {
        await Promise.all([await userRepository.save(context.sender!), await channelRepository.save(context.chat!)])
    } catch (error) {
        Logger.error('Ошибка при попытке сохранить контекст', error)
    }
}
