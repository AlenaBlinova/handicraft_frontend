import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Container,
    Group,
    InputWrapper,
    Paper,
    Stack,
    Table,
    Text,
    TextInput,
    Title,
    Tooltip
} from "@mantine/core";
import {Layout} from "../components/Layout";
import {useDispatch, useSelector} from "react-redux";
import {cancelOrder, getOrders, updateUser, userSelector} from "../app/userSlice";
import {useEffect} from "react";
import {useForm} from "@mantine/form";
import {X} from "tabler-icons-react";
import {useModals} from "@mantine/modals";
import {EmailConfirmForm} from "../components/EmailConfirmForm";
import axios from "axios";
import {BASE_API_URL} from "../constants/baseApiUrl";
import {Status} from "../components/Status";
import {TitleBlock} from "../components/TitleBlock";
import {CANCELED, DONE} from "../constants/orderStatuses";
export function Profile() {
    const dispatch = useDispatch()
    const modals = useModals()
    const {email, username, emailConfirmed, orders, phone} = useSelector(userSelector)
    useEffect(() => {
        dispatch(getOrders())
    }, [])

    const handleCancel = (id) => {
        dispatch(cancelOrder({id}))
    }

    const form = useForm({
        initialValues: {
            email: "",
            username: "",
            phone: ""
        }
    })

    useEffect(() => {
        form.setValues({
            email, username, phone
        })
    }, [email, phone, username])

    const resetPassword = () => {
        modals.openConfirmModal({
            title: "Смена пароля",
            labels: {confirm: 'Отправить', cancel: 'Отмена'},
            children: <Text>Вам будет выслано письмо с сылкой на смену пароля</Text>,
            onConfirm() {
                axios.post(BASE_API_URL + "/auth/forgot", {
                    email
                }).catch(console.log)
            }
        })
    }

    const startEmailConfirmation = () => {
        axios.get(BASE_API_URL + "/auth/verify", {
            headers: {
                authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).then(res => {
            modals.openModal({
                title: "Подтверждение Email",
                children: <EmailConfirmForm/>
            })
        })
    }

    const handleSubmit = (values) => {
        dispatch(updateUser({email: values.email, username: values.username, phone: values.phone}))
    }

    return <Layout>
        <Container size={"md"}>
            <TitleBlock order={3} mb={"md"}>
                Ваш профиль
            </TitleBlock>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Paper shadow={'lg'} p={"md"} mb={"md"}>
                    <Container size={"25rem"}>
                        <Stack>
                            <Group spacing={0} direction={"column"} position={"center"} grow>
                                <TextInput disabled={!username} {...form.getInputProps("email")} label={"Email"}/>
                            </Group>
                            <Group spacing={0} direction={"column"} position={"center"} grow>
                                <InputWrapper label={"Email подтвержден"} sx={{width: "100%"}}>
                                    <Box sx={{width: "100%"}}>
                                        <Tooltip label={"Нажмите для подтверждения"} sx={{width: "100%"}}
                                                 position={"left"}>
                                            <Button disabled={!username || !!emailConfirmed} sx={{width: "100%"}} onClick={startEmailConfirmation}>
                                                <Text sx={{textAlign: "center"}}>
                                                    {emailConfirmed ? "Да" : "Нет"}
                                                </Text>
                                            </Button>
                                        </Tooltip>
                                    </Box>
                                </InputWrapper>
                            </Group>
                            <Group spacing={0} direction={"column"} position={"center"} grow>
                                <TextInput disabled={!username} {...form.getInputProps("username")} label={"Имя пользователя"}/>
                            </Group>
                            <Group spacing={0} direction={"column"} position={"center"} grow>
                                <TextInput disabled={!username} {...form.getInputProps("phone")} value={phone} label={"Номер телефона"}/>
                            </Group>
                            <Button type={"submit"} disabled={!username}>Сохранить данные</Button>
                            <Button color={"blue"} disabled={!username} onClick={resetPassword}>Изменить пароль</Button>
                        </Stack>
                    </Container>
                </Paper>
            </form>
            <TitleBlock order={3} mb={"md"}>
                Ваши заказы
            </TitleBlock>
            <Paper shadow={'lg'} mb={"md"}>
                <Container>
                    <Table verticalSpacing={"sm"} >
                        <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Время</th>
                            <th>Статус</th>
                            <th style={{textAlign: "center"}}>Отмена</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders && orders.map(order => <tr key={order.id}>
                            <td>
                                <Text>{new Date(order.createdAt).toLocaleDateString()}</Text>
                            </td>
                            <td>
                                <Text>{new Date(order.createdAt).toLocaleTimeString()}</Text>
                            </td>
                            <td>
                                <Status status={order.status}/>
                            </td>
                            <td>
                                <Group position={"center"}>
                                    <Tooltip label={"Отменить заказ"}>
                                        <ActionIcon color={"red"}
                                                    onClick={() => handleCancel(order.id)}
                                                    disabled={order.status === DONE ||
                                                        order.status === CANCELED}>
                                            <X/>
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            </td>
                        </tr>)}
                        </tbody>
                    </Table>
                </Container>
            </Paper>
        </Container>
    </Layout>
}