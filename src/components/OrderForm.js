import {Box, Button, Group, Select} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useDispatch} from "react-redux";
import {updateOrder} from "../app/ordersSlice";
import {CANCELED, DONE, IN_PROCESSING, MANUFACTURING} from "../constants/orderStatuses";

export const OrderForm = ({order}) => {

    const dispatch = useDispatch()

    const statuses = [
        {label: "В обработке", value: IN_PROCESSING},
        {label: "Изготавливается", value: MANUFACTURING},
        {label: "Завершен", value: DONE},
        {label: "Отменен", value: CANCELED}
    ]

    const form = useForm({
        initialValues: {
            status: order.status,
        }
    })

    const handleSubmit = (values) => {
        dispatch(updateOrder({id: order.id, payload: values}))
    }

    return <Box mx="auto" sx={{maxWidth: "30rem", position: "relative"}}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Select data={statuses} {...form.getInputProps("status")} label={"Статус"}/>
            <Group position={"right"} mt={"md"}>
                <Button type={"submit"}>Сохранить</Button>
            </Group>
        </form>
    </Box>
}