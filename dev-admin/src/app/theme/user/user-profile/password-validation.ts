import { FormGroup } from '@angular/forms';

export class RegistrationValidator {
    static validate(changePasswordForm: FormGroup) {
        console.log('Password Form',changePasswordForm);
        let password = changePasswordForm.controls.new_password.value;
        let repeatPassword = changePasswordForm.controls.confirm_password.value;

        if (repeatPassword.length <= 0) {
            return null;
        }

        if (repeatPassword !== password) {
            return {
                doesMatchPassword: true
            };
        }

        return null;

    }
}