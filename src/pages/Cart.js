import {Layout} from "../components/Layout";
import {ActionIcon, Button, Container, Group, Paper, Stack, Text, TextInput, Title, Tooltip} from "@mantine/core";
import {useDispatch, useSelector} from "react-redux";
import {cartSelector, clear, decrease, increase, remove} from "../app/cartSlice";
import {useEffect, useState} from "react";
import axios from "axios";
import {BASE_API_URL} from "../constants/baseApiUrl";
import {CurrencyRubel, Minus, Plus, ShoppingCartX} from "tabler-icons-react";
import {useForm} from "@mantine/form";
import {TitleBlock} from "../components/TitleBlock";

export function Cart() {

    const cart = useSelector(cartSelector)

    const [toys, setToys] = useState([])
    const [totalPrice, setTotal] = useState(0)

    const dispatch = useDispatch()

    useEffect(() => {
        axios.get(BASE_API_URL + "/toys").then(res => {
            setToys(res.data)
        })
    }, [])

    useEffect(() => {
        if (toys.length < 1) return
        const mapped = cart
            .map(item => {
                const candidate = toys.find(f => f.id === item.id)
                return ({...item, price: candidate.price})
            })
        setTotal(mapped
            .reduce((a, b) => a + Number(b.price) * b.count, 0))
    }, [toys, cart])

    const handleIncrease = (id) => {
        dispatch(increase({id}))
    }

    const handleDecrease = (id) => {
        dispatch(decrease({id}))
    }

    const handleDelete = (id) => {
        dispatch(remove({id}))
    }

    const form = useForm({
        initialValues: {
            name: "",
            phone: ""
        }
    })

    const handleSubmit = (values) => {
        axios.post(BASE_API_URL + "/orders", {
            name: values.name,
            phone: values.phone,
            toysList: cart
        }, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).then(res => {
            dispatch(clear())
        })
    }

    return (
        <Layout>
            <Container size={"md"}>
                <TitleBlock mb={"md"} order={3}>
                    Корзина
                </TitleBlock>
                <Paper shadow={'lg'} p={"md"} mb={"md"}>
                    <Container size={"xs"}>
                        <Group spacing={0} position={"center"} direction={"column"}>
                            <Text size={"lg"} weight={700}>Итоговая сумма:</Text>
                            <Group spacing={0}>
                                <Text size={"xl"}>
                                    {totalPrice}
                                </Text>
                                <CurrencyRubel size={16}/>
                            </Group>
                        </Group>
                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <TextInput placeholder={"Номер телефона"} label={"Телефон"}
                                       required description={"Чтобы курьер мог уведомить вас о доставке"} {...form.getInputProps("phone")}/>
                            <TextInput placeholder={"Как к вам обращаться?"}
                                       label={"ФИО"} {...form.getInputProps("name")}/>
                            <Group position={"center"} mt={"md"}>
                                <Button type={"submit"}>Отправить</Button>
                            </Group>
                        </form>
                    </Container>
                </Paper>
                <TitleBlock mb={"md"} order={3}>
                    Состав корзины
                </TitleBlock>
                <Stack>
                    {toys.length > 0 && cart.map(item => {
                        const candidate = toys.find(f => f.id === item.id)
                        return <Paper shadow={'lg'} p={"md"}>
                            <Group position={"apart"}>
                                <Group spacing={0}>
                                    <Text
                                        align={"center"}>{candidate.title} х {item.count} x {candidate.price}</Text>
                                    <CurrencyRubel size={16}/>
                                </Group>
                                <Group>
                                    <Tooltip label={"Добавить"} withArrow>
                                        <ActionIcon onClick={() => handleIncrease(item.id)}>
                                            <Plus/>
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label={"Уменьшить"} withArrow>
                                        <ActionIcon onClick={() => handleDecrease(item.id)}>
                                            <Minus/>
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label={"Удалить из корзины"} withArrow>
                                        <ActionIcon color={"red"} onClick={() => handleDelete(item.id)}>
                                            <ShoppingCartX/>
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            </Group>
                        </Paper>
                    })}
                </Stack>
            </Container>
        </Layout>
    );
}