import {Group, Paper, Title} from "@mantine/core";

export const TitleBlock = ({children, order, rightSide, ...other}) => {
    return <Paper p={"md"} shadow={"lg"} {...other}>
        <Group position={"apart"}>
            <Title order={order}>
                {children}
            </Title>
            {rightSide}
        </Group>
    </Paper>
}