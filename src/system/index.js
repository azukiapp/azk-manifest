import { _ } from 'azk-core';export class System {  constructor(manifest, name, image, options = {}) {    this.manifest = manifest;    this.name     = name;    this.image    = image;    this.options  = options;    if (_.isString(image)) {      image = { docker: image };      this.deprecatedImage = true;    }  }}