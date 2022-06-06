import {
    Box,
    Button,
    Group,
    LoadingOverlay,
    MultiSelect,
    NumberInput, Select,
    Textarea,
    TextInput,
    useMantineTheme
} from "@mantine/core";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {dropzoneChildren} from "./Dropzone";
import {useEffect, useState} from "react";
import {useForm} from "@mantine/form";
import axios from "axios";
import {BASE_API_URL} from "../constants/baseApiUrl";
import {CurrencyRubel} from "tabler-icons-react";
import {useDispatch} from "react-redux";
import {createToy, updateToy} from "../app/categorySlice";

export function ToyForm({categoryId, toy = null}) {
    const dispatch = useDispatch()
    const theme = useMantineTheme();
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])

    useEffect(() => {
        axios.get(BASE_API_URL + "/categories").then(res => {
            setCategories(res.data.map(category => ({value: category.id.toString(), label: category.title})))
        })
    }, [])

    const uploadImage = (file) => {
        const formData = new FormData()
        formData.append('upload', file)
        return axios.post(BASE_API_URL + "/images", formData, {
            headers: {
                "Content-Type": 'multipart/form-data',
            }
        })
    }

    const uploadToy = (values, thumbnailId) => {
        const data = {
            title: values.title,
            description: values.description,
            categoryId: Number(values.category),
            price: values.price,
            thumbnailId,
        }

        if (!toy) {
            dispatch(createToy({payload: data})).then(() => setLoading(false)).catch(() => setLoading(false))
        } else {
            dispatch(updateToy({
                id: toy.id,
                payload: data
            })).then(() => setLoading(false)).catch(() => setLoading(false))
        }
    }

    const handleSubmit = (values) => {
        setLoading(true)
        if (values.thumbnail.file) {
            uploadImage(values.thumbnail.file).then(res => {
                uploadToy(values, res.data.id)
            })
        } else {
            uploadToy(values)
        }
    }

    const form = useForm({
        initialValues: {
            title: "",
            description: "",
            price: 0,
            category: categoryId,
            thumbnail: {
                data: '',
                file: null
            }
        }
    });

    useEffect(() => {
        if (toy) {
            form.setValues({
                title: toy.title,
                description: toy.description,
                category: toy.categoryId.toString(),
                price: Number(toy.price),
                thumbnail: {
                    data: toy.thumbnailId,
                    file: null
                }
            })
        }
    }, [toy])

    return <Box mx="auto" sx={{maxWidth: "30rem", position: "relative"}}>
        <LoadingOverlay visible={loading}/>
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
                required
                label="Название игрушки"
                placeholder="Зайчик из шерсти"
                {...form.getInputProps('title')}
            />
            <Textarea
                required
                label="Описание игрушки"
                placeholder="Мягкий и гипоралергенный"
                {...form.getInputProps('description')}
            />

            <NumberInput
                required
                label="Цена одной штуки"
                placeholder="Введите цену игрушки"
                min={0}
                icon={<CurrencyRubel size={18}/>}
                {...form.getInputProps("price")}
            />

            <Select
                label="Выбор категории"
                data={categories}
                value={form.values.category}
                placeholder="Выбери категорию"
                searchable
                clearable
                {...form.getInputProps('category')}
            />

            <Box my={"md"}>
                <Dropzone
                    onDrop={(files) => {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                            form.setFieldValue('thumbnail', {
                                data: e.target.result,
                                file: files[0]
                            })
                        }

                        reader.readAsDataURL(files[0])
                    }}
                    multiple={false}
                    onReject={(files) => console.log('rejected files', files)}
                    maxSize={3 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                >
                    {(status) => dropzoneChildren(status, theme, form.values.thumbnail)}
                </Dropzone>
            </Box>
            <Group position="apart" mt="md">
                <Button type="submit">Сохранить</Button>
            </Group>
        </form>
    </Box>
}