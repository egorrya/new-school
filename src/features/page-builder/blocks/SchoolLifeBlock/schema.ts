import type { Block } from 'payload'

export const SchoolLifeBlock: Block = {
  slug: 'schoolLife',
  interfaceName: 'SchoolLifeBlock',
  labels: {
    singular: 'Школьная жизнь',
    plural: 'Школьная жизнь',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      required: true,
      defaultValue: 'Больше, чем учеба',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      required: true,
      defaultValue:
        'Дружелюбная атмосфера, праздники, внеклассные мероприятия, разнообразные экскурсии, литературные гостиные, театральные постановки — все для раскрытия талантов каждого ребенка.',
    },
  ],
}
