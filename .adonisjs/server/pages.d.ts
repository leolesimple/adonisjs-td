import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.tsx'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.tsx'))['default']>
    'projection/index': ExtractProps<(typeof import('../../inertia/pages/projection/index.tsx'))['default']>
    'sources/index': ExtractProps<(typeof import('../../inertia/pages/sources/index.tsx'))['default']>
    'wishes/index': ExtractProps<(typeof import('../../inertia/pages/wishes/index.tsx'))['default']>
    'wishes/show': ExtractProps<(typeof import('../../inertia/pages/wishes/show.tsx'))['default']>
  }
}
