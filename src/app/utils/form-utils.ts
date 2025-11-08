import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

async function sleep() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2500);
  });
}

export class FormUtils {
  // Expresiones regulares
  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
  static slugPattern = '^[a-z0-9_]+(?:-[a-z0-9_]+)*$';

  static getTextError(errors: ValidationErrors) {
    /**
     * Funcion que retorna el mensaje de error segun el tipo de error
     * recibido.
     *
     * @param errors - ValidationErrors
     * @returns string | null
     */
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;

        case 'min':
          return `Valor mínimo de ${errors['min'].min}`;

        case 'email':
          return `El valor ingresado no es un correo electrónico`;

        case 'emailTaken':
          return `El correo electrónico ya está siendo usado por otro usuario`;

        case 'noStrider':
          return `No se puede usar el username de strider en la app`;

        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
            return 'El valor ingresado no luce como un correo electrónico';
          }

          return 'Error de patrón contra expresión regular';

        default:
          return `Error de validación no controlado ${key}`;
      }
    }

    return null;
  }

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    /**
     * Funcion que retorna si un campo del formulario es valido
     * o no.
     *
     * @param form - FormGroup
     * @param fieldName - string
     * @returns boolean | null
     */
    return (
      !!form.controls[fieldName].errors && form.controls[fieldName].touched
    );
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    /**
     * Funcion que retorna el mensaje de error de un campo
     * del formulario.
     * @param form - FormGroup
     * @param fieldName - string
     * @return string | null
     */
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static isValidFieldInArray(formArray: FormArray, index: number) {
    /**
     * Funcion que retorna si un campo dentro de un FormArray
     * es valido o no.
     * @param formArray - FormArray
     * @param index - number
     * @returns boolean | null
     */
    return (
      formArray.controls[index].errors && formArray.controls[index].touched
    );
  }

  static getFieldErrorInArray(
    formArray: FormArray,
    index: number
  ): string | null {
    /**
     * Funcion que retorna el mensaje de error de un campo
     * dentro de un FormArray.
     * @param formArray - FormArray
     * @param index - number
     * @returns string | null
     */
    if (formArray.controls.length === 0) return null;

    const errors = formArray.controls[index].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static isFieldOneEqualFieldTwo(field1: string, field2: string) {
    /**
     * Funcion que valida si dos campos de un formulario son iguales.
     * @param field1 - string
     * @param field2 - string
     * @returns (formGroup: AbstractControl) => ValidationErrors | null
     */
    return (formGroup: AbstractControl) => {
      const field1Value = formGroup.get(field1)?.value;
      const field2Value = formGroup.get(field2)?.value;

      return field1Value === field2Value ? null : { passwordsNotEqual: true };
    };
  }

  static async checkingServerResponse(
    control: AbstractControl
  ): Promise<ValidationErrors | null> {
    /**
     * Funcion que simula una validacion asincrona contra
     * un servidor.
     * @param control - AbstractControl
     * @returns Promise<ValidationErrors | null>
     */
    console.log('Validando contra servidor');

    await sleep(); // 2 segundos y medio

    const formValue = control.value;

    if (formValue === 'hola@mundo.com') {
      return {
        emailTaken: true,
      };
    }

    return null;
  }

  // static notStrider(control: AbstractControl): ValidationErrors | null {
  //   const value = control.value;

  //   return value === 'strider' ? { noStrider: true } : null;
  // }
}
