import React, {useEffect} from 'react';
import {Anchor, Button, Checkbox, Container, Group, Paper, PasswordInput, Text, TextInput, Title,} from '@mantine/core';
import {Link, useNavigate, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {clearState, exchangeToken, loginUser, userSelector} from "../app/userSlice";
import {useForm} from "@mantine/form";

export function SignIn() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isSuccess, isError} = useSelector(
        userSelector
    );
    useEffect(() => {
        return () => {
            dispatch(clearState());
        };
    }, []);

    useEffect(() => {
        if (isError) {
            dispatch(clearState());
        }

        if (isSuccess) {
            dispatch(clearState());
            dispatch(exchangeToken({accessToken: localStorage.getItem('accessToken')}))
            navigate('/');
        }
    }, [isError, isSuccess]);

    const form = useForm({
        initialValues: {
            email: "",
            password: ""
        }
    })

    const handleSubmit = (values) => {
        dispatch(loginUser(values));
    }

    return (
        <Container size={420} my={40}>
            <Title
                align="center"
                sx={(theme) => ({fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900})}
            >
                Добро пожаловать!
            </Title>
            <Text color="dimmed" size="sm" align="center" mt={5}>
                Нет аккаунта?{' '}
                <Anchor
                    component={Link}
                    to={"/signup"}
                    size="sm">
                    Регистрация
                </Anchor>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput label="Email" placeholder="you@mantine.dev" required {...form.getInputProps("email")}/>
                    <PasswordInput label="Пароль" placeholder="Your password" required mt="md" {...form.getInputProps("password")}/>
                    <Button fullWidth mt="xl" type={"submit"}>
                        Войти
                    </Button>
                    <Group position="center" mt="md">
                        {/*<Checkbox label="Remember me"/>*/}
                        <Anchor component={Link} to={"/forgot"} size="sm">
                            Забыли пароль?
                        </Anchor>
                    </Group>
                </form>
            </Paper>
        </Container>
    )
}