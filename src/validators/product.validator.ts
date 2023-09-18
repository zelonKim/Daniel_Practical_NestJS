import validator from 'validator';

export class ProductValidator {
  static imageWhiteList: string[] = [ // contains the list of valid MIME types for the image files
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
  ];

  // 'body' contains the information collected from the forms
  // 'file' contains the uploaded image
  // 'toValidate' contains a set of labels to determine which validations should be applied 
  static validate(body, file: Express.Multer.File, toValidate: string[]) {
    const errors: string[] = [];

    if (toValidate.includes('name') && validator.isEmpty(body.name)) { // isEmpty() method verifies if the argument is empty.
      errors.push('Product name cannot be empty');
    }

    if (
      toValidate.includes('description') &&
      validator.isEmpty(body.description)
    ) {
      errors.push('Product description cannot be empty');
    }

    if (
      toValidate.includes('price') &&
      !validator.isInt(body.price, { min: 0 }) // validates 'body.price' has a minimum value of 0
    ) {
      errors.push('Product price must be not negative');
    }

    if (toValidate.includes('imageCreate')) {
      if (file === undefined) {
        errors.push('You must upload a product image');
      } else if (!ProductValidator.imageWhiteList.includes(file.mimetype)) {
        errors.push('Invalid image format');
      }
    }

    if (toValidate.includes('imageUpdate')) {
      if (
        file !== undefined &&
        !ProductValidator.imageWhiteList.includes(file.mimetype)
      ) {
        errors.push('Invalid image format');
      }
    }
    return errors;
  }
}
