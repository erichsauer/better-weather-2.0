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
import getDestinations from '../utils/fetchUtils';

const initialFormState = {
  zipCode: '97211',
  radius: 2,
  clouds: 30,
  rain: 0.2,
  temp: 50,
  dayIndex: 0,
};

function FormControls({ setDestinations }) {
  const validateForm = (value) => {
    let error;
    if (!value.zipCode) {
      error = 'Zip code is required';
    } else if
    (value.zipCode.length < 5) {
      error = 'Valid zip code required';
    }
    return error;
  };

  const handleSubmit = async (values, actions) => {
    console.log('hello world?');
    const destinations = await getDestinations(values);

    setDestinations(destinations);
    actions.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialFormState}
      onSubmit={handleSubmit}
    >
      {(props) => (
        <Form>
          <Field name="zipCode" validate={validateForm}>
            {({ field, form }) => (
              <FormControl isRequired isInvalid={form.errors.name && form.touched.name}>
                <FormLabel>Zip Code</FormLabel>
                <Input
                  {...field}
                  placeholder="Zip Code"
                />
              </FormControl>
            )}
          </Field>
          <Field name="radius" validate={validateForm}>
            {({ field, form }) => (
              <FormControl isRequired isInvalid={form.errors.name && form.touched.name}>
                <FormLabel>Search Radius</FormLabel>
                <Input
                  {...field}
                  placeholder="1"
                />
              </FormControl>
            )}
          </Field>
          <Field name="dayIndex" validate={validateForm}>
            {({ field, form }) => (
              <FormControl isRequired isInvalid={form.errors.name && form.touched.name}>
                <FormLabel>Day of the Week</FormLabel>
                <Input
                  {...field}
                  placeholder="Today"
                />
              </FormControl>
            )}
          </Field>
          {/* <Field name="clouds" validate={validateForm}>
            {({ field, form }) => (
              <FormControl isRequired isInvalid={form.errors.name && form.touched.name}>
                <FormLabel>Cloud Cover</FormLabel>
                <Input
                  {...field}
                  placeholder=""
                />
              </FormControl>
            )}
          </Field>
          <Field name="rain" validate={validateForm}>
            {({ field, form }) => (
              <FormControl isRequired isInvalid={form.errors.name && form.touched.name}>
                <FormLabel>Chance of Rain</FormLabel>
                <Input
                  {...field}
                  placeholder=""
                />
              </FormControl>
            )}
          </Field>
          <Field name="temp" validate={validateForm}>
            {({ field, form }) => (
              <FormControl isRequired isInvalid={form.errors.name && form.touched.name}>
                <FormLabel>Temperature</FormLabel>
                <Input
                  {...field}
                  placeholder=""
                />
              </FormControl>
            )}
          </Field> */}
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
  );
}

export default FormControls;
