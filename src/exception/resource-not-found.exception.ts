import { HttpException, HttpExceptionOptions, HttpStatus } from '@nestjs/common';
import { response } from 'express';

export class ResourceNotFoundException extends HttpException {
  constructor(resourceName: string, id: string) {
    super(`Cannot find a ${resourceName.toLowerCase()} with identity: '${id}'`, HttpStatus.NOT_FOUND);
  }
}