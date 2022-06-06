import React from 'react';
import {
    createStyles,
    Menu,
    Center,
    Header,
    Container,
    Group,
    Button,
    Burger, Tooltip, Text, ActionIcon, Indicator, Title, Anchor,
} from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import {ChevronDown, Flower, Logout, Settings, ShoppingCart} from 'tabler-icons-react';
import {useDispatch, useSelector} from "react-redux";
import {logoutUser, userSelector} from "../app/userSlice";
import {cartSelector} from "../app/cartSlice";
import {Link} from "react-router-dom";

const HEADER_HEIGHT = 64;

const useStyles = createStyles((theme) => ({
    inner: {
        height: HEADER_HEIGHT,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    links: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: '8px 12px',
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        '&:hover': {
            textDecoration: "none",
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },

    linkLabel: {
        marginRight: 5,
    },
}));

export function HeaderWithNav({ links }) {
    const { classes, theme } = useStyles();
    const [opened, toggleOpened] = useBooleanToggle(false);

    const dispatch = useDispatch()
    const {isSuccess, username, isAdmin} = useSelector(userSelector);
    const cart = useSelector(cartSelector)

    return (
        <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0 }}>
            <Container className={classes.inner}>
                <Group>
                    <Burger
                        opened={opened}
                        onClick={() => toggleOpened()}
                        className={classes.burger}
                        size="sm"
                    />
                    <Group sx={{color: theme.colors.indigo[6]}} spacing={"sm"}>
                        <Flower size={36}/>
                        <Title order={2}>Toys</Title>
                    </Group>
                </Group>
                <Group spacing={5} className={classes.links}>
                    <Anchor className={classes.link} component={Link} to={"/"}>
                        Главная
                    </Anchor>
                    <Anchor className={classes.link} component={Link} to={"/catalog"}>
                        Каталог
                    </Anchor>
                    <Anchor className={classes.link} component={Link} to={"/about"}>
                        О нас
                    </Anchor>
                </Group>
                <Group>
                    {!isSuccess ? <>
                        <Button component={Link} to={"/signin"}
                                href={"/signin"}
                                radius={"xl"}
                                className={classes.secondaryLink}
                        >
                            Вход
                        </Button>
                    </> : <>
                        <Group>
                            <Menu
                                sx={{cursor: "pointer"}}
                                size={260}
                                placement="end"
                                transition="pop-top-right"
                                control={
                                    <Tooltip label={"Меню пользователя"} position={"left"} withArrow>
                                        <Text size={"md"}>{username}</Text>
                                    </Tooltip>
                                }
                            >
                                {isAdmin && <>
                                    <Menu.Label>Админситратор</Menu.Label>
                                    <Menu.Item component={Link} to="/orders" icon={<Settings size={14}/>}>
                                        Заказы
                                    </Menu.Item>
                                </>}
                                <Menu.Label>Настройки</Menu.Label>
                                <Menu.Item component={Link} to="/account" icon={<Settings size={14}/>}>
                                    Настройки аккаунта
                                </Menu.Item>
                                <Menu.Item onClick={() => {
                                    localStorage.removeItem("accessToken")
                                    dispatch(logoutUser())
                                }} icon={<Logout size={14}/>}>Выйти</Menu.Item>
                            </Menu>
                        </Group>
                    </>}
                    <Tooltip label={"Корзина"} position={"right"} withArrow>
                        <ActionIcon color={"indigo"} size={"lg"} variant="filled" component={Link} to={"/cart"}>
                            {cart.length > 0 ? <>
                                <Indicator color={"red"} label={cart.length} size={18}>
                                    <ShoppingCart size={24}/>
                                </Indicator>
                            </> : <ShoppingCart size={24}/>}
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Container>
        </Header>
    );
}