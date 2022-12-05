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
  yupValidation?: any;
  value?: string;
  options?: Options[];
  minLength?: number;
  maxLength?: number;
}

export const parseYupValidation = (_fieldsSchema: Field[]) => {
  const validations = _fieldsSchema.reduce(
    (obj, cur: any) => ({ ...obj, [cur.name]: cur.yupValidation }),
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
          {fields.map((f: Field) => {
            return (
              <Box mt={4} key={f.name}>
                <RenderFields
                  type={f.type}
                  name={f.name}
                  label={f.label}
                  minLength={f.minLength}
                  maxLength={f.maxLength}
                  options={f.options}
                />
              </Box>
            );
          })}
          {renderSubmit}

          {!renderSubmit && (
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
        </Form>
      )}
    </Formik>
  );
};

export const RenderFields = ({ type, ...props }: any) => {
  switch (type) {
    case "select":
      return <SelectField {...props} />;
    case "only-numbers":
      return <InputField onlyNumber {...props} />;
    case "money":
      return <InputField money {...props} />;
    case "only-letters":
      return <InputField onlyLetters {...props} />;
    default:
      return <InputField {...props} />;
  }
};

const SelectField = ({ label, name, ...props }: any) => {
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

  const { money, onlyNumber, onlyLetters, minLength, maxLength } = props;

  return (
    <TextField
      {...field}
      {...props}
      onChange={(e) => {
        if (onlyNumber) {
          e.target.value = e.target.value.replace(/\D/g, "");
        } else if (money) {
          e.target.value = String(parseCurrency(e.target.value));
          e.target.value = formatCurrency(parseFloat(e.target.value));
        } else if (onlyLetters) {
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
        if (money) {
          e.target.value = String(parseCurrency(e.target.value));
          if (!parseFloat(e.target.value)) {
            helpers.setValue("");
          }
        }
        field.onBlur(e);
      }}
      inputProps={{
        maxLength: maxLength ?? 999,
        minLength: minLength ?? 0,
      }}
      InputProps={{
        startAdornment:
          money && field.value ? (
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
