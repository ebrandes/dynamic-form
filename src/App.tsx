import { Box, Button, Container, Typography } from "@mui/material";
import { Form, Formik, FormikHelpers, FormikValues, useField } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import DynamicForm, {
  Field,
  parseInitialValues,
  parseToOptions,
  parseYupValidation,
  RenderFields,
} from "./DynamicForm";

function App() {
  const selectProps = [
    {
      cbc: 1,
      name: "xx",
      value: "332",
      anoterThing: 13,
      checked: true,
    },
    {
      cbc: 2,
      name: "yyy",
      value: "waqqq22",
      anoterThing: 1544,
    },
  ];

  const [fieldsSchema, setFieldSchema] = useState<Field[]>([
    {
      name: "name",
      type: "just-letters",
      label: "Nome",
      yupvalidation: yup.string().required("Custom MSG de erro"),
      value: "Eduardo Brandes",
      minLength: 2,
      maxLength: 1,
    },
    // {
    //   name: "age",
    //   type: "just-numbers",
    //   label: "Idade",
    //   yupvalidation: yup.string().required("Padrão"),
    //   value: "10",
    // },
    // {
    //   name: "email",
    //   type: "email",
    //   label: "Email",
    //   yupvalidation: yup
    //     .string()
    //     .email("Email inválido")
    //     .required("Campo de email obrigatório"),
    //   value: "",
    // },
    // {
    //   name: "money",
    //   type: "currency",
    //   label: "Valor",
    //   yupvalidation: yup.string().required(),
    //   value: "",
    // },
    {
      name: "role",
      type: "select",
      label: "Roles",
      yupvalidation: yup.lazy((value) =>
        typeof value === "object"
          ? yup.object().required("Campo obrigatório")
          : yup.string().required("Campo obrigatório")
      ),
      value: "",
      options: parseToOptions("name", "value", selectProps),
    },
    {
      name: "interests",
      type: "checkbox",
      label: (
        <>
          <Typography variant="h5" component="h2" fontWeight="800">
            Interesses
          </Typography>
          <Typography fontSize="small">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt,
            dolores laudantium libero suscipit atque deleniti deserunt esse
            exercitationem tenetur aperiam vitae aut pariatur molestiae ipsa
            earum mollitia vel repudiandae nesciunt!
          </Typography>
        </>
      ),
      yupvalidation: yup.array().min(1, "Selecione ao menos 1 checkbox"),
      value: [],
      horizontal: true,
      options: [
        {
          checked: true,
          label: "Movies",
          value: "MOVIES",
        },
        {
          checked: false,
          label: "Tv Series",
          value: "TV_SERIES",
        },
      ],
    },
    {
      name: "terms",
      type: "checkbox",
      label: "Aceite de termos",
      value: [],
      yupvalidation: yup.array().min(1, "Termos são obrigatórios"),
      options: [
        {
          checked: true,
          label: "Aceito os termos",
          value: true,
        },
      ],
    },
    {
      name: "quiz",
      type: "radio",
      horizontal: true,
      label: "Pop quiz: MUI is...",
      // yupvalidation: yup.string().required("Campo obrigatório"),
      value: "",
      options: [
        {
          label: "The best!",
          value: "BEST",
        },
        {
          label: "The worst!",
          value: "WROST",
        },
      ],
    },
  ]);

  useEffect(() => {
    const copy = [...fieldsSchema];
    const index = copy.findIndex(f => f.name === 'role');
    copy[index].value = selectProps[0].value;
    setFieldSchema(copy);
    // eslint-disable-next-line
  }, []);

  const RenderSubmit = () => {
    // eslint-disable-next-line
    const [field, meta, helpers] = useField("name");

    return (
      <Box mt={4}>
        <Button type="submit">Enviar Custom</Button>
        <Button type="reset">Limpar</Button>
        <Button onClick={() => helpers.setValue("Andrielle Salvador")}>
          Trocar nome para Andrielle Salvador
        </Button>
      </Box>
    );
  };

  return (
    <Container>
      <Typography>EXEMPLO 1</Typography>

      <Box mb={4}>
        <DynamicForm
          fields={fieldsSchema}
          renderSubmit={<RenderSubmit />}
          onSubmit={(
            values: FormikValues,
            actions: FormikHelpers<FormikValues>
          ) => {
            const selectedValue = selectProps.find(
              (sp) => sp.value === values.role
            );
            console.log(values, selectedValue);
            actions.resetForm()
          }}
        />
      </Box>

      <Typography>EXEMPLO 2</Typography>

      <Box mt={5}>
        <Formik
          initialValues={parseInitialValues(fieldsSchema)}
          validationSchema={parseYupValidation(fieldsSchema)}
          validateOnBlur={true}
          enableReinitialize={true}
          onSubmit={(values, actions) => {
            console.log(values);
            setTimeout(() => actions.setSubmitting(false), 600);
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit} noValidate>
              {fieldsSchema.map((field) => (
                <Box mt={3} key={field.name}>
                  <RenderFields {...field} type={field.type} />
                </Box>
              ))}
              <Box mt={4}>
                <Button
                  fullWidth
                  disabled={isSubmitting}
                  variant="contained"
                  type="submit"
                >
                  Enviar
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}

export default App;
