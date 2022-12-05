import {
  formatCurrency,
  parseCurrency,
} from "@brazilian-utils/brazilian-utils";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { Form, Formik, useField } from "formik";
import * as yup from "yup";

interface Options {
  label: string;
  value: string;
}
export interface Field {
  name: string;
  type: string;
  label: string;
  yupvalidation?: any;
  value?: string;
  options?: Options[];
  minLength?: number;
  maxLength?: number;
}

export const parseYupValidation = (_fieldsSchema: Field[]) => {
  const validations = _fieldsSchema.reduce(
    (obj, cur: any) => ({ ...obj, [cur.name]: cur.yupvalidation }),
    {}
  );
  return yup.object().shape(validations);
};

export const parseInitialValues = (_fieldsSchema: Field[]) => {
  return _fieldsSchema.reduce(
    (obj, cur: any) => ({ ...obj, [cur.name]: cur.value }),
    {}
  );
};

const DynamicForm = ({ fields, renderSubmit, onSubmit, ...props }: any) => {
  return (
    <Formik
      initialValues={parseInitialValues(fields)}
      validationSchema={parseYupValidation(fields)}
      validateOnBlur={true}
      enableReinitialize={true}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit} noValidate>
          <>
            {fields.map((f: Field) => {
              return (
                <Box mt={4} key={f.name}>
                  <RenderFields {...f}
                  />
                </Box>
              );
            })}

            {renderSubmit || (
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
            )}
          </>
        </Form>
      )}
    </Formik>
  );
};

export const RenderFields = ({ type, ...props }: any) => {
  switch (type) {
    case "select":
      return <SelectField {...props} />;
    case "just-numbers":
      return <InputField justnumbers="true" {...props} />;
    case "currency":
      return <InputField currency="true" {...props} />;
    case "just-letters":
      return <InputField justletters="true" {...props} />;
    default:
      return <InputField {...props} />;
  }
};

const SelectField = ({ label, name, ...props }: any) => {
  // eslint-disable-next-line
  const [field, meta, helpers] = useField(name);

  return (
    <FormControl fullWidth size="small" error={!!meta.touched && !!meta.error}>
      <InputLabel
        id={name}
        variant="outlined"
        sx={{ backgroundColor: "white", px: 1 }}
      >
        {label}
      </InputLabel>
      <Select
        {...props}
        {...field}
        id={name}
        labelId={name}
        variant="outlined"
        renderValue={(value) => `⚠️  - ${value}`}
        value={field.value ?? ""}
      >
        <MenuItem value="">
          <em>Nenhum registro</em>
        </MenuItem>

        {props.options &&
          props.options.map((opt: any) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
      </Select>
      {!!meta.touched && !!meta.error && meta.error && (
        <FormHelperText>{meta.error}</FormHelperText>
      )}
    </FormControl>
  );
};

const InputField = ({ label, name, ...props }: any) => {
  const [field, meta, helpers] = useField(name);

  const { currency, justnumbers, justletters, minlength, maxlength } = props;

  return (
    <TextField
      {...field}
      {...props}
      onChange={(e) => {
        if (justnumbers) {
          e.target.value = e.target.value.replace(/\D/g, "");
        } else if (currency) {
          e.target.value = String(parseCurrency(e.target.value));
          e.target.value = formatCurrency(parseFloat(e.target.value));
        } else if (justletters) {
          e.target.value = e.target.value.replace(/[0-9]/g, "");
        }
        field.onChange(e);
      }}
      size="small"
      fullWidth
      value={field.value ?? ""}
      placeholder={label}
      label={label}
      onBlur={(e) => {
        if (currency) {
          e.target.value = String(parseCurrency(e.target.value));
          if (!parseFloat(e.target.value)) {
            helpers.setValue("");
          }
        }
        field.onBlur(e);
      }}
      inputProps={{
        maxLength: maxlength ?? 999,
        minLength: minlength ?? 0,
      }}
      InputProps={{
        startAdornment:
          currency && field.value ? (
            <span style={{ marginRight: "5px" }}>R$</span>
          ) : (
            ""
          ),
      }}
      error={!!meta.touched && !!meta.error}
      helperText={!!meta.touched && !!meta.error && meta.error}
    />
  );
};

export default DynamicForm;
