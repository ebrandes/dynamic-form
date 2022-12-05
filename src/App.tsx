import { Box, Button, Container, Typography } from "@mui/material";
import { Form, Formik, FormikValues, FormikHelpers, useField } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import DynamicForm, {
  Field,
  parseInitialValues,
  parseYupValidation,
  RenderFields,
} from "./DynamicForm";

function App() {
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
    {
      name: "age",
      type: "just-numbers",
      label: "Idade",
      yupvalidation: yup.string().required("Padrão"),
      value: "",
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      yupvalidation: yup
        .string()
        .email("Email inválido")
        .required("Campo de email obrigatório"),
      value: "",
    },
    {
      name: "money",
      type: "currency",
      label: "Valor",
      yupvalidation: yup.string().required(),
      value: "",
    },
    {
      name: "role",
      type: "select",
      label: "Roles",
      yupvalidation: yup.string().required(),
      value: "",
      options: [
        {
          label: "Admin",
          value: "ADMIN",
        },
        {
          label: "User",
          value: "USER",
        },
      ],
    },
  ]);

  useEffect(() => {
    const copy = [...fieldsSchema];
    const index = copy.findIndex((f) => f.name === "role");
    copy[index].value = "ADMIN";
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
            console.log(values);
            actions.resetForm();
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
