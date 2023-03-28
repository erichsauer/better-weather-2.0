/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import fetchForecast from '../utils/fetchUtils';

function FormControls() {
  const initialFormState = {
    zip: '',
  };
  const [formState, setFormState] = useState(initialFormState);
  const [forecastResults, setForecastResults] = useState({});

  const validateForm = (value) => {
    let error;
    if (!value) {
      error = 'Zip code is required';
    } else if
    (value.length < 5) {
      error = 'Valid zip code required';
    }
    return error;
  };

  const handleSubmit = async (values, actions) => {
    setFormState(values);
    const forecast = await fetchForecast();
    setForecastResults(forecast);
    console.log(forecastResults);
    actions.setSubmitting(false);
  };

  return (
    <>
      <Formik
        initialValues={initialFormState}
        values={formState}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <Field name="zip" validate={validateForm}>
              {({ field, form }) => (
                <FormControl isRequired isInvalid={form.errors.name && form.touched.name}>
                  <FormLabel>Zip Code</FormLabel>
                  <Input {...field} placeholder="Zip Code" />
                </FormControl>
              )}
            </Field>
            <Button
              mt={4}
              colorScheme="teal"
            // isLoading={props.isSubmitting}
              type="submit"
            >
              Find Better Weather!
            </Button>
          </Form>
        )}
      </Formik>
      <div>results</div>
    </>
  );
}

export default FormControls;
