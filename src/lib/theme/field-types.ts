/**
 * Field vocabulary the admin forms are built from.
 *
 * A section declares its editable content as a list of these; the customizer
 * renders the form generically, so adding a field is a data change rather than
 * a new component.
 */

export interface FieldBase {
  /** Property name within the object this field belongs to. */
  key: string;
  label: string;
  help?: string;
}

export interface TextFieldDef extends FieldBase {
  type: "text";
  placeholder?: string;
  maxLength?: number;
}

export interface TextareaFieldDef extends FieldBase {
  type: "textarea";
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

/** Multi-paragraph body copy. Rendered as plain text with blank-line breaks. */
export interface RichTextFieldDef extends FieldBase {
  type: "richtext";
  placeholder?: string;
  rows?: number;
}

export interface ImageFieldDef extends FieldBase {
  type: "image";
  placeholder?: string;
}

export interface LinkFieldDef extends FieldBase {
  type: "link";
  placeholder?: string;
}

export interface ToggleFieldDef extends FieldBase {
  type: "toggle";
}

export interface SelectFieldDef extends FieldBase {
  type: "select";
  options: { label: string; value: string }[];
}

export interface IconFieldDef extends FieldBase {
  type: "icon";
}

export interface NumberFieldDef extends FieldBase {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

export interface RepeaterFieldDef extends FieldBase {
  type: "repeater";
  /** Sub-field whose value titles the collapsed row. */
  itemLabelKey: string;
  /** Singular noun used in the "Add …" button. */
  itemNoun: string;
  min?: number;
  max?: number;
  fields: FieldDef[];
  /** Shape used when the merchant adds a row. */
  defaultItem: Record<string, unknown>;
}

export type FieldDef =
  | TextFieldDef
  | TextareaFieldDef
  | RichTextFieldDef
  | ImageFieldDef
  | LinkFieldDef
  | ToggleFieldDef
  | SelectFieldDef
  | IconFieldDef
  | NumberFieldDef
  | RepeaterFieldDef;
