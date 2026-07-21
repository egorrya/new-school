'use client'

import { BulkUploadProvider, TranslationProvider, UploadInput, useConfig, useField, useTranslation } from '@payloadcms/ui'
import type { UploadInputProps } from '@payloadcms/ui'
import type { AcceptedLanguages, Language } from '@payloadcms/translations'
import type { UploadFieldClientProps, Validate } from 'payload'
import React, { useCallback, useMemo } from 'react'

import deepMerge from '@/utilities/deepMerge'

const logoFieldTranslations = {
  general: {
    createNew: 'Загрузить',
    createNewLabel: 'Загрузить {{label}}',
  },
}

const mergeFieldStyles = (field: UploadFieldClientProps['field']): React.CSSProperties => ({
  ...(field?.admin?.style || {}),
  ...(field?.admin?.width ? { '--field-width': field.admin.width } : { flex: '1 1 auto' }),
  ...(field?.admin?.style?.flex ? { flex: field.admin.style.flex } : {}),
})

type UploadValidateOptions = Parameters<NonNullable<UploadFieldClientProps['validate']>>[1]

export const LogoUploadField: React.FC<UploadFieldClientProps> = (props) => {
  const {
    field,
    field: {
      admin: { allowCreate, className, description, isSortable } = {},
      displayPreview,
      hasMany,
      label,
      localized,
      maxRows,
      relationTo: relationToFromProps,
      required,
    },
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const { config } = useConfig()
  const { i18n, languageOptions } = useTranslation()

  const memoizedValidate = useCallback<Validate<unknown, unknown, unknown, object>>(
    (value, options) => {
      if (typeof validate === 'function') {
        const uploadOptions = options as UploadValidateOptions

        return validate(value, {
          ...uploadOptions,
          required,
        })
      }

      return true
    },
    [validate, required],
  )

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    filterOptions,
    path,
    setValue,
    showError,
    value: valueFromField,
  } = useField({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const isPolymorphic = Array.isArray(relationToFromProps)

  const memoizedValue = useMemo<UploadInputProps['value']>(() => {
    if (hasMany === true) {
      return Array.isArray(valueFromField)
        ? valueFromField.map((val) => {
            return isPolymorphic
              ? val
              : {
                  relationTo: Array.isArray(relationToFromProps)
                    ? relationToFromProps[0]
                    : relationToFromProps,
                  value: val,
                }
          })
        : (valueFromField as UploadInputProps['value'])
    }

    return valueFromField as UploadInputProps['value']
  }, [hasMany, isPolymorphic, relationToFromProps, valueFromField])

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  const translations = useMemo(
    () => deepMerge(i18n.translations, logoFieldTranslations),
    [i18n.translations],
  )

  return (
    <BulkUploadProvider drawerSlugPrefix={pathFromProps}>
      <TranslationProvider
        dateFNSKey={i18n.dateFNSKey as Language['dateFNSKey']}
        fallbackLang={i18n.fallbackLanguage as AcceptedLanguages}
        language={i18n.language}
        languageOptions={languageOptions}
        switchLanguageServerAction={async () => {}}
        translations={translations}
      >
        <UploadInput
          AfterInput={AfterInput}
          allowCreate={allowCreate !== false}
          api={config.routes.api}
          BeforeInput={BeforeInput}
          className={className}
          Description={Description}
          description={description}
          displayPreview={displayPreview}
          Error={Error}
          filterOptions={filterOptions}
          hasMany={hasMany}
          isSortable={isSortable}
          label={label}
          Label={Label}
          localized={localized}
          maxRows={maxRows}
          onChange={setValue}
          path={path}
          readOnly={readOnly || disabled}
          relationTo={relationToFromProps}
          required={required}
          serverURL={config.serverURL}
          showError={showError}
          style={styles}
          value={memoizedValue}
        />
      </TranslationProvider>
    </BulkUploadProvider>
  )
}

export default LogoUploadField
