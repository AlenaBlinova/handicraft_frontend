import React from 'react';
import {ActionIcon, Button, Card, createStyles, Group, Image, Menu, Text} from '@mantine/core';
import {ChevronDown, CurrencyRubel, Pencil, Trash} from 'tabler-icons-react';
import {useDispatch} from "react-redux";
import {addToCart} from "../app/cartSlice";
import {BASE_API_URL} from "../constants/baseApiUrl";
import {ToyForm} from "./ToyForm";
import {useModals} from "@mantine/modals";
import {deleteToy} from "../app/categorySlice";

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },

    label: {
        marginBottom: theme.spacing.xs,
        lineHeight: 1,
        fontWeight: 700,
        fontSize: theme.fontSizes.xs,
        letterSpacing: -0.25,
        textTransform: 'uppercase',
    },

    section: {
        padding: theme.spacing.md,
        borderTop: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
        }`,
    },

    icon: {
        marginRight: 5,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[5],
    },

    button: {
        paddingRight: 0,
        width: "100%",
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: theme.radius.xl,
        borderBottomLeftRadius: theme.radius.xl,
    },

    menuControl: {
        borderTopRightRadius: theme.radius.xl,
        borderBottomRightRadius: theme.radius.xl,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        border: 0,
        borderLeft: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}`,
    },
}));

export function ToyCard({toy, isAdmin = false}) {
    const {classes, theme} = useStyles();
    const menuIconColor = theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 5 : 6];
    const dispatch = useDispatch()
    const modals = useModals()

    const handleAdd = (e) => {
        dispatch(addToCart({id: toy.id}))
    }

    const openEditModal = (e) => {
        modals.openModal({
            title: "Изменение игрушки",
            children: <ToyForm toy={toy}/>
        })
    }

    const handleDelete = (e) => {
        dispatch(deleteToy({id: toy.id}))
    }

    return (
        <Card withBorder radius="md" className={classes.card}>
            <Card.Section>
                {/*<Image src="https://i.imgur.com/ZL52Q2D.png" alt="Tesla Model S" />*/}
                <Image src={toy.thumbnailId ? BASE_API_URL + "/images/" + toy.thumbnailId : null} height={180}
                       withPlaceholder alt={"Toy Image"}/>
            </Card.Section>

            <Group position="apart" my="md">
                <div>
                    <Text weight={500}>{toy.title}</Text>
                    <Text size="xs" color="dimmed">
                        {toy.description}
                    </Text>
                </div>
            </Group>

            <Card.Section className={classes.section}>
                <Group spacing={30}>
                    <div>
                        <Group spacing={0} position={"center"} sx={{textAlign: "center"}}>
                            <Text size="xl" weight={700}>
                                {toy.price}
                            </Text>
                            <CurrencyRubel size={18}/>
                        </Group>
                    </div>

                    {!isAdmin && <Button radius="xl" style={{flex: 1}} onClick={handleAdd}>
                        В корзину
                    </Button>}
                    {isAdmin && <Group noWrap spacing={0} sx={{flex: 1}}>
                        <Button onClick={handleAdd} className={classes.button}>В корзину</Button>
                        <Menu
                            control={
                                <ActionIcon
                                    variant="filled"
                                    color={theme.primaryColor}
                                    size={36}
                                    className={classes.menuControl}
                                >
                                    <ChevronDown size={16}/>
                                </ActionIcon>
                            }
                            transition="pop"
                            placement="end"
                        >
                            <Menu.Item onClick={openEditModal} icon={<Pencil size={16} color={menuIconColor}/>}>
                                Изменить
                            </Menu.Item>
                            <Menu.Item onClick={handleDelete}
                                       icon={<Trash size={16} color={"red"}/>}>Удалить</Menu.Item>
                        </Menu>
                    </Group>}
                </Group>
            </Card.Section>
        </Card>
    );
}