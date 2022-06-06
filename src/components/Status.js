import {Badge} from "@mantine/core";
import {CANCELED, DONE, IN_PROCESSING, MANUFACTURING} from "../constants/orderStatuses";

export function Status({status}) {
    switch (status) {
        case IN_PROCESSING:
            status = <Badge>В обработке</Badge>
            break
        case MANUFACTURING:
            status = <Badge color={"blue"}>Готовится</Badge>
            break
        case DONE:
            status = <Badge color={"indigo"}>Выполнен</Badge>
            break
        case CANCELED:
            status = <Badge color={"red"}>Отменен</Badge>
            break
        default:
            status = <Badge color={"gray"}>Не известен</Badge>
    }
    return status
}
