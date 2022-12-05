import { Box, Button, Container, Typography } from "@mui/material";
import {
  Form,
  Formik,
  FormikValues,
  FormikHelpers,
  useFormikContext,
} from "formik";
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
      type: "only-letters",
      label: "Nome",
      yupValidation: yup.string().required(),
      value: "Eduardo Brandes",
      maxLength: 2,
      minLength: 1,
    },
    {
      name: "age",
      type: "only-numbers",
      label: "Idade",
      yupValidation: yup.string().required(),
      value: "",
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      yupValidation: yup.string().email("Email inválido").required(),
      value: "",
    },
    {
      name: "money",
      type: "money",
      label: "Valor",
      yupValidation: yup.string().required(),
      value: "",
    },
    {
      name: "role",
      type: "select",
      label: "Roles",
      yupValidation: yup.string().required(),
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

  const { setFieldValue, values } = useFormikContext() ?? {};

  useEffect(() => {
    const copy = [...fieldsSchema];
    const index = copy.findIndex((f) => f.name === "role");
    copy[index].value = "ADMIN";
    setFieldSchema(copy);
  }, []);

  const RenderSubmit = () => (
    <Box mt={4}>
      <Button type="submit">Enviar Custom</Button>
      <Button type="reset">Limpar</Button>
      <Button
        onClick={() => {
          debugger;
          console.log(values);
          setFieldValue("name", "Brandeszord");
        }}
      >
        Trocar nome
      </Button>
    </Box>
  );

  return (
    <Container>
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

      <Typography>Form dinamico com Formik de base</Typography>

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
                <Box mt={3}>
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
