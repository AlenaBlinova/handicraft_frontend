import {Layout} from "../components/Layout";
import {Box, Button, Container, createStyles, Group, Menu, Overlay, Paper, SimpleGrid, Title} from "@mantine/core";
import {TitleBlock} from "../components/TitleBlock";
import {useDispatch, useSelector} from "react-redux";
import {categoriesSelector, deleteCategory, getCategories} from "../app/categoriesSlice";
import {useEffect} from "react";
import {BASE_API_URL} from "../constants/baseApiUrl";
import {Link} from "react-router-dom";
import {userSelector} from "../app/userSlice";
import {Pencil, TrashX} from "tabler-icons-react";
import {useModals} from "@mantine/modals";
import {CategoryForm} from "../components/CategoryForm";

const useStyles = createStyles((theme, _, getRef) => ({
    box: {
        position: "relative",
        width: "100%",
        backgroundColor: theme.colors.gray[1],
        borderRadius: theme.radius.md,
        '&:before': {
            content: `''`,
            display: "block",
            paddingTop: "100%",
        }
    },
    boxContent: {
        position: 'absolute',
        padding: theme.spacing.sm,
        textAlign: "center",
        justifyContent: "center",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        height: '100%',
        '&:hover': {
            [`& .${getRef('buttons')}`]: {
                visibility: "visible"
            }
        }
    },

    buttons: {
        ref: getRef('buttons'),
        visibility: "hidden",
        position: "absolute",
        top: theme.spacing.sm, right: theme.spacing.sm,
        zIndex: 202
    },
}))

const Block = ({category, isAdmin}) => {
    const {classes, theme} = useStyles()
    const modals = useModals()
    const dispatch = useDispatch()

    const openEditingModal = (e) => {
        modals.openModal({
            title: "Изменение категории",
            children: <CategoryForm category={category}/>
        })
    }

    const handleDelete = (e) => {
        dispatch(deleteCategory({id: category.id}))
    }

    return <Link to={"/catalog/" + category.id}>
        <Box
            className={classes.box}
            sx={{backgroundImage: `url(${BASE_API_URL + "/images/" + category.thumbnailId + "?width=300"})`}}>
            <Box className={classes.boxContent}>
                <Group className={classes.buttons}>
                    {isAdmin && <Menu onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}>
                        <Menu.Item onClick={openEditingModal} icon={<Pencil size={14}/>}>Изменить</Menu.Item>
                        <Menu.Item onClick={handleDelete} icon={<TrashX size={14}/>}
                                   color={"red"}>Удалить</Menu.Item>
                    </Menu>}
                </Group>
                <Overlay opacity={0.3} color="#000" blur={2} radius={theme.radius.md} zIndex={1}/>
                <Paper shadow={"lg"} py={"sm"} sx={{zIndex: 3}}>
                    <Title order={3}>
                        {category.title}
                    </Title>
                </Paper>
            </Box>
        </Box>
    </Link>
}

export const Catalog = () => {

    const dispatch = useDispatch()
    const categories = useSelector(categoriesSelector)
    const {isAdmin} = useSelector(userSelector)
    const modals = useModals()

    useEffect(() => {
        dispatch(getCategories())
    }, [])

    const openCreatingModal = (e) => {
        modals.openModal({
            title: "Создание категории",
            children: <CategoryForm/>
        })
    }

    return <Layout>
        <Container>
            <TitleBlock mb={"md"} order={3} rightSide={
                <>
                    {isAdmin && <Button onClick={openCreatingModal}>Создать категорию</Button>}
                </>
            }>
                Каталог
            </TitleBlock>
            <SimpleGrid cols={3}>
                {categories.map(category => <Block key={category.id} category={category} isAdmin={isAdmin}/>)}
            </SimpleGrid>
        </Container>
    </Layout>
}