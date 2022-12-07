import {
  formatCurrency,
  parseCurrency,
} from "@brazilian-utils/brazilian-utils";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { Box } from "@mui/system";
import { Form, Formik, useField } from "formik";
import { ReactNode } from "react";
import * as yup from "yup";

interface Option {
  label: string;
  value: string | boolean;
  checked?: boolean;
}
export interface Field {
  name: string;
  type: string;
  label: string | ReactNode;
  yupvalidation?: any;
  value?: string | string[];
  horizontal?: boolean;
  options?: Option[];
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

export const parseToOptions = (_label: string, _value: string, array: any[]): Option[] => {
  return array.map((a: any) => ({
    label: String(a[_label]),
    value: a[_value],
    checked: a.checked ?? false
  }));
};

export const parseInitialValues = (_fieldsSchema: Field[]) => {
  const parsedValues = _fieldsSchema.reduce((obj, cur: any) => {
    if (cur.type === "checkbox") {
      const getValues = (cur: any) => {
        const values = cur.options.map((opt: Option) => {
          return opt.checked ? String(opt.value) : "";
        });
        return values.filter((v: string) => v !== "");
      };

      return {
        ...obj,
        [cur.name]: getValues(cur),
      };
    }
    return { ...obj, [cur.name]: cur.value };
  }, {});
  return parsedValues;
};

const DynamicForm = ({ fields, renderSubmit, onSubmit }: any) => {
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
                  <RenderFields {...f} />
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
    case "checkbox":
      return <CheckboxField {...props} />;
    case "radio":
      return <RadioField {...props} />;
    default:
      return <InputField {...props} />;
  }
};

const RadioField = ({
  name,
  label,
  horizontal = false,
  options,
  ...props
}: any) => {
  // eslint-disable-next-line
  const [field, meta, helpers] = useField(name);

  const errorField = () => {
    if (!!meta.error && !!meta.touched) {
      return {
        color: red[800],
        "&.Mui-checked": {
          color: red[600],
        },
      };
    }
    return {};
  };

  return (
    <FormGroup>
      {label}
      <RadioGroup
        row={horizontal}
        aria-labelledby={name}
        name={name}
        value={field.value}
        onChange={field.onChange}
      >
        {options &&
          options.map((opt: Option) => (
            <FormControlLabel
              key={opt.value}
              {...props}
              sx={errorField()}
              value={opt.value}
              control={<Radio sx={errorField()} />}
              label={opt.label}
            />
          ))}
      </RadioGroup>
      {!!meta.error && !!meta.touched && (
        <FormHelperText sx={errorField()}>{meta.error}</FormHelperText>
      )}
    </FormGroup>
  );
};

const CheckboxField = ({
  name,
  horizontal = false,
  label,
  options,
  ...props
}: any) => {
  // eslint-disable-next-line
  const [field, meta, helpers] = useField(name);

  const errorField = () => {
    if (!!meta.error && !!meta.touched) {
      return {
        color: red[800],
        "&.Mui-checked": {
          color: red[600],
        },
      };
    }
    return {};
  };

  return (
    <FormGroup>
      {label}
      <Box display={horizontal ? "flex" : ""}>
        {options &&
          options.map(({ label, value }: Option, index: number) => {
            return (
              <FormControlLabel
                {...props}
                key={index}
                label={<Typography sx={errorField()}>{label}</Typography>}
                name={name}
                sx={errorField()}
                onChange={field.onChange}
                control={
                  <Checkbox
                    sx={errorField()}
                    checked={field.value?.includes(String(value))}
                    value={value}
                  />
                }
              />
            );
          })}
      </Box>
      {!!meta.error && !!meta.touched && (
        <FormHelperText sx={errorField()}>{meta.error}</FormHelperText>
      )}
    </FormGroup>
  );
};

const SelectField = ({ label, name, options, ...props }: any) => {
  // eslint-disable-next-line
  const [field, meta, helpers] = useField(name);

  const getLabel = (value: unknown) => {
    return options.find((opt: Option) => opt.value === value)?.label;
  }

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
        renderValue={(value) => `⚠️  - ${getLabel(value)}`}
        value={field.value ?? options.find((opt: Option) => opt.checked ?? opt.value)}
      >
        <MenuItem value="">
          <em>Nenhum registro</em>
        </MenuItem>

        {options &&
          options.map((opt: any) => (
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
