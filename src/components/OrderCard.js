import {Box, Button, Card, Collapse, createStyles, Group, Stack, Text, UnstyledButton} from "@mantine/core";
import {useState} from "react";
import {useModals} from "@mantine/modals";
import {OrderForm} from "./OrderForm";
import {ChevronDown, ChevronUp} from "tabler-icons-react";
import {Status} from "./Status";

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },

    label: {
        // marginBottom: theme.spacing.xs,
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
}));

export const OrderCard = ({order, toys}) => {
    const {classes} = useStyles()
    const modals = useModals()
    const [customerInfoVisible, setCustomerInfoVisible] = useState(false)
    const [toysInfoVisible, setToysInfoVisible] = useState(false)

    const openEditModal = (e) => {
        modals.openModal({
            title: "Изменение заказа",
            children: <OrderForm order={order}/>
        })
    }

    return <Card key={order.id} className={classes.card}>
        <Card.Section className={classes.section}>
            <Text size="sm" color="dimmed" className={classes.label}>
                Дата и время заказа
            </Text>
            <Group position={"apart"}>
                <Group spacing={4}>
                    <Text>Дата: </Text><Text>{new Date(order.createdAt).toLocaleDateString()}</Text>
                </Group>
                <Group spacing={4}>
                    <Text>Время:</Text><Text>{new Date(order.createdAt).toLocaleTimeString()}</Text>
                </Group>
            </Group>
        </Card.Section>
        <Card.Section className={classes.section}>
            <Text size="sm" color="dimmed" className={classes.label} mb={'xs'}>
                Информация о заказе
            </Text>
            <Group spacing={4}>
                <Text weight={"bold"}>Сумма заказа:</Text><Text>{order.totalPrice}</Text>
            </Group>
            <Group spacing={4}>
                <Text weight={"bold"}>Статус:</Text><Status status={order.status}/>
            </Group>
        </Card.Section>
        <Card.Section className={classes.section}>
            <UnstyledButton onClick={() => setCustomerInfoVisible(!customerInfoVisible)}>
                <Group spacing={2}>
                    {customerInfoVisible ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                    <Text size="sm" color="dimmed" className={classes.label}>
                        Информация о заказчике
                    </Text>
                </Group>
            </UnstyledButton>
            <Collapse in={customerInfoVisible}>
                <Group spacing={4}>
                    <Text weight={"bold"}>Телефон:</Text><Text>{order.phone}</Text>
                </Group>
                <Group spacing={4}>
                    <Text weight={"bold"}>ФИО:</Text><Text>{order.name}</Text>
                </Group>
            </Collapse>
        </Card.Section>
        <Card.Section className={classes.section}>
            <UnstyledButton onClick={() => setToysInfoVisible(!toysInfoVisible)}>
                <Group spacing={2}>
                    {toysInfoVisible ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                    <Text size="sm" color="dimmed" className={classes.label}>
                        Игрушки
                    </Text>
                </Group>
            </UnstyledButton>
            <Collapse in={toysInfoVisible}>
                <Stack spacing={1}>
                    {order.toys.map(({count, toy}) => <Box key={toy.id}>
                        {toy.title} x {count}
                    </Box>)}
                </Stack>
            </Collapse>
        </Card.Section>
        <Card.Section className={classes.section}>
            <Button onClick={openEditModal}>Изменить заказ</Button>
        </Card.Section>
    </Card>
}