import { useTranslation } from "react-i18next";
import { Form, type FormInstance, Input } from "antd";
import { createSchemaFieldRule } from "antd-zod";
import { z } from "zod";

import { type AccessConfigForDogeCloud } from "@/domain/access";

type AccessEditFormDogeCloudConfigFieldValues = Partial<AccessConfigForDogeCloud>;

export type AccessEditFormDogeCloudConfigProps = {
  form: FormInstance;
  formName: string;
  disabled?: boolean;
  initialValues?: AccessEditFormDogeCloudConfigFieldValues;
  onValuesChange?: (values: AccessEditFormDogeCloudConfigFieldValues) => void;
};

const initFormModel = (): AccessEditFormDogeCloudConfigFieldValues => {
  return {
    accessKey: "",
    secretKey: "",
  };
};

const AccessEditFormDogeCloudConfig = ({ form, formName, disabled, initialValues, onValuesChange }: AccessEditFormDogeCloudConfigProps) => {
  const { t } = useTranslation();

  const formSchema = z.object({
    accessKey: z
      .string()
      .min(1, t("access.form.dogecloud_access_key.placeholder"))
      .max(64, t("common.errmsg.string_max", { max: 64 }))
      .trim(),
    secretKey: z
      .string()
      .min(1, t("access.form.dogecloud_secret_key.placeholder"))
      .max(64, t("common.errmsg.string_max", { max: 64 }))
      .trim(),
  });
  const formRule = createSchemaFieldRule(formSchema);

  const handleFormChange = (_: unknown, values: z.infer<typeof formSchema>) => {
    onValuesChange?.(values as AccessEditFormDogeCloudConfigFieldValues);
  };

  return (
    <Form form={form} disabled={disabled} initialValues={initialValues ?? initFormModel()} layout="vertical" name={formName} onValuesChange={handleFormChange}>
      <Form.Item
        name="accessKey"
        label={t("access.form.dogecloud_access_key.label")}
        rules={[formRule]}
        tooltip={<span dangerouslySetInnerHTML={{ __html: t("access.form.dogecloud_access_key.tooltip") }}></span>}
      >
        <Input autoComplete="new-password" placeholder={t("access.form.dogecloud_access_key.placeholder")} />
      </Form.Item>

      <Form.Item
        name="secretKey"
        label={t("access.form.dogecloud_secret_key.label")}
        rules={[formRule]}
        tooltip={<span dangerouslySetInnerHTML={{ __html: t("access.form.dogecloud_secret_key.tooltip") }}></span>}
      >
        <Input.Password autoComplete="new-password" placeholder={t("access.form.dogecloud_secret_key.placeholder")} />
      </Form.Item>
    </Form>
  );
};

export default AccessEditFormDogeCloudConfig;
