

type Fields<M> = {
  [key in keyof M]: {
    name: key,
    fields?: Fields<M[key]>
  }
};

interface TestModel {
  a: string;
  b: number;
  c: {
    cA: string;
  }
}

interface  ModeledConfig<M = any > {
  meta: string;
  fields: Fields<M>;
}

const keyedNameExampleConfig: ModeledConfig<TestModel> = {
  meta: 'name',
  fields: {
    a: {
     name: 'a'
    },
    b: {
      name: 'b'
    },
    c: {
      name: 'c',
      fields: {
        cA: {
          name: 'cA'
        }
      }
    }
  }
}



interface Field<M, K extends keyof M> {
  name: K;
  type: 'select' | 'text' | 'number'
}

interface SubGroupField<M, K extends keyof M> extends Omit<Field<M, K>, 'type'> {
  type: 'subGroup',
  fields?: Field<M[K], keyof M[K]>[];
}

interface ModeledArrayConfig<M, K extends keyof M> {
  meta: string;
  fields: Field<M, K>[] | SubGroupField<M[K], keyof M[K]>[];
}


const fieldsArrayExampleConfig: ModeledArrayConfig<TestModel, keyof TestModel> = {
  meta: 'name',
  fields: [
    {
      type: 'text',
      name: 'b'
    },
    {
      type: 'text',
      name: 'a'
    },
    // {
    //   type: 'subGroup',
    //   name: 'c',
    //   fields: [
    //     {
    //       type: 'text',
    //       name: 'cA'
    //     }
    //   ]
    // }
  ]
};

export type ExtractModelFromFields<T extends Field<T, keyof T>[]> = {
  [k in keyof T]: {
    k: k;
    v: T[k];
  };
};

type DerivedModel = ExtractModelFromFields<typeof fieldsArrayExampleConfig.fields>;
