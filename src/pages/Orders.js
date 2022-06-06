import {Layout} from "../components/Layout";
import {Box, Container, SimpleGrid} from "@mantine/core";
import {useEffect, useState} from "react";
import axios from "axios";
import {BASE_API_URL} from "../constants/baseApiUrl";
import {useDispatch, useSelector} from "react-redux";
import {userSelector} from "../app/userSlice";
import {useNavigate} from "react-router-dom";
import {OrderCard} from "../components/OrderCard";
import {getOrders, ordersSelector} from "../app/ordersSlice";
import {TitleBlock} from "../components/TitleBlock";

export function Orders() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {isAdmin, isSuccess} = useSelector(userSelector)

    useEffect(() => {
        if (isSuccess && !isAdmin) return navigate("/")
    })

    const orders = useSelector(ordersSelector)
    const [toys, setToys] = useState([])

    useEffect(() => {
        dispatch(getOrders())

        axios.get(BASE_API_URL + "/toys").then(res => {
            setToys(res.data)
        })
    }, [])

    return <Layout>
        <Container>
            <TitleBlock order={3} mb={"md"}>
                Заказы
            </TitleBlock>
            <SimpleGrid cols={3}>
                {orders.map(order => <Box key={order.id}>
                    <OrderCard order={order} toys={toys}/>
                </Box>)}
            </SimpleGrid>
        </Container>
    </Layout>
}