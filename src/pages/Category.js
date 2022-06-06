import {Layout} from "../components/Layout";
import {useParams} from "react-router";
import {Button, Container, SimpleGrid} from "@mantine/core";
import {TitleBlock} from "../components/TitleBlock";
import {useDispatch, useSelector} from "react-redux";
import {getCategory, toysSelector} from "../app/categorySlice";
import {useEffect} from "react";
import {ToyCard} from "../components/ToyCard";
import {ToyForm} from "../components/ToyForm";
import {useModals} from "@mantine/modals";
import {userSelector} from "../app/userSlice";

export const Category = () => {
    const {categoryId} = useParams()
    const dispatch = useDispatch()
    const modals = useModals()
    const {isAdmin} = useSelector(userSelector)
    const toys = useSelector(toysSelector)
    const title = useSelector(state => state.category.title)

    useEffect(() => {
        dispatch(getCategory({categoryId}))
    }, [])

    const openCreationModal = (e) => {
        modals.openModal({
            title: "Создание игрушки",
            children: <ToyForm categoryId={categoryId}/>
        })
    }

    return <Layout>
        <Container>
            <TitleBlock
                order={3}
                mb={"md"}
                rightSide={<>
                    {isAdmin && <Button onClick={openCreationModal}>Создать игрушку</Button>}
                </>}
            >
                {title}
            </TitleBlock>
            <SimpleGrid cols={3}>
                {toys.map(toy => <ToyCard toy={toy} key={toy.id} isAdmin={isAdmin}/>)}
            </SimpleGrid>
        </Container>
    </Layout>
}