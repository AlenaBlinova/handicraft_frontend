import {Box, Button, Group, LoadingOverlay, TextInput, useMantineTheme} from "@mantine/core";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {dropzoneChildren} from "./Dropzone";
import {useEffect, useState} from "react";
import {useForm} from "@mantine/form";
import axios from "axios";
import {BASE_API_URL} from "../constants/baseApiUrl";
import {useDispatch} from "react-redux";
import {createCategory, updateCategory} from "../app/categoriesSlice";

export function CategoryForm({category = null}) {
    const dispatch = useDispatch()
    const theme = useMantineTheme();
    const [loading, setLoading] = useState(false)

    const uploadImage = (file) => {
        const formData = new FormData()
        formData.append('upload', file)
        return axios.post(BASE_API_URL + "/images", formData, {
            headers: {
                "Content-Type": 'multipart/form-data',
            }
        })
    }

    const uploadCategory = (values, thumbnailId) => {
        const data = {
            title: values.title,
            thumbnailId,
        }

        if (!category) {
            dispatch(createCategory({payload: data}))
                .then(() => setLoading(false))
                .catch(() => setLoading(false))
        } else {
            dispatch(updateCategory({
                id: category.id,
                payload: data
            }))
                .then(() => setLoading(false))
                .catch(() => setLoading(false))
        }
    }

    const handleSubmit = (values) => {
        setLoading(true)
        if (values.thumbnail.file) {
            uploadImage(values.thumbnail.file).then(res => {
                uploadCategory(values, res.data.id)
            })
        } else {
            uploadCategory(values)
        }
    }

    const form = useForm({
        initialValues: {
            title: "",
            thumbnail: {
                data: '',
                file: null
            }
        }
    });

    useEffect(() => {
        if (category) {
            form.setValues({
                title: category.title,
                thumbnail: {
                    data: category.thumbnailId,
                    file: null
                }
            })
        }
    }, [category])

    return <Box mx="auto" sx={{maxWidth: "30rem", position: "relative"}}>
        <LoadingOverlay visible={loading}/>
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
                required
                label="Название категории"
                placeholder="Плюшевые игрушки"
                {...form.getInputProps('title')}
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