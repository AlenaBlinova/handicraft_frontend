import React from 'react';
import {createStyles, Text, SimpleGrid, Container, Title, Group, Paper} from '@mantine/core';
import { Truck, Certificate, Coin } from 'tabler-icons-react';

const useStyles = createStyles((theme) => ({
    feature: {
        position: 'relative',
        paddingTop: theme.spacing.xl,
        paddingLeft: theme.spacing.xl,
    },

    overlay: {
        position: 'absolute',
        height: 100,
        width: 160,
        top: 0,
        left: 0,
        backgroundColor:
            theme.colorScheme === 'dark'
                ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
                : theme.colors[theme.primaryColor][0],
        zIndex: 1,
    },

    content: {
        position: 'relative',
        zIndex: 2,
    },

    icon: {
        color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6],
    },

    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
}));
function Feature({ icon: Icon, title, description, className, ...others }) {
    const { classes, cx } = useStyles();

    return (
        <div className={cx(classes.feature, className)} {...others}>
            <div className={classes.overlay} />

            <div className={classes.content}>
                <Icon size={38} className={classes.icon} />
                <Text weight={700} size="lg" mb="xs" mt={5} className={classes.title}>
                    {title}
                </Text>
                <Text color="dimmed" size="sm">
                    {description}
                </Text>
            </div>
        </div>
    );
}

const data = [
    {
        icon: Truck,
        title: 'Качественные изделия',
        description:
            'Великолепные материлы российского производства',
    },
    {
        icon: Certificate,
        title: 'Ручная работа',
        description:
            'Каждая игрушка сделана вручную с душой',
    },
    {
        icon: Coin,
        title: 'Низкие цены',
        description:
            'Здесь вы можете не беспокоится о высоких ценах на качественные изделия',
    },
];

export function FeaturesAsymmetrical() {
    const items = data.map((item) => <Feature {...item} key={item.title} />);

    return (
        <Container mt={30} mb={30} size="lg">
            <Paper px={"lg"} py={"xl"} shadow={"lg"}>
                <Group position={"center"} mb={"md"}>
                    <Title>Наши достоинства</Title>
                </Group>
                <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]} spacing={50}>
                    {items}
                </SimpleGrid>
            </Paper>
        </Container>
    );
}