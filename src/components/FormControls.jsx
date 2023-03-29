/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { fetchLatLon, getDestinations } from '../utils/fetchUtils';

const initialFormState = {
  zip: '',
  radius: 2,
  clouds: 30,
  rain: 0.2,
  temp: 50,
};

function FormControls({ setDestinations }) {
  const [formState, setFormState] = useState(initialFormState);

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
    const {
      radius, clouds, rain, temp,
    } = formState;

    const { centerLat, centerLon, name } = await fetchLatLon(values.zip);

    const destinations = await getDestinations(centerLat, centerLon, {
      radius, clouds, rain, temp,
    });

    console.log(destinations, name);

    setDestinations(destinations);
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
