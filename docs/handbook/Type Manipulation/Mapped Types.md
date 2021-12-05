---
title: Mapped Types
layout: docs
permalink: /docs/handbook/2/mapped-types.html
oneline: "Generating types by re-using an existing type."
---

When you don't want to repeat yourself, sometimes a type needs to be based on another type.

当你不想重复自己的时候，有时候一种类型需要基于另一种类型。

Mapped types build on the syntax for index signatures, which are used to declare the types of properties which have not been declared ahead of time:

映射类型建立在索引签名的语法之上，索引签名用于声明未提前声明的属性类型:



```ts twoslash
type Horse = {};
// ---cut---
type OnlyBoolsAndHorses = {
  [key: string]: boolean | Horse;
};

const conforms: OnlyBoolsAndHorses = {
  del: true,
  rodney: false,
};
```

A mapped type is a generic type which uses a union of `PropertyKey`s (frequently created [via a `keyof`](/docs/handbook/2/indexed-access-types.html)) to iterate through keys to create a type:
映射类型是一种泛型类型，它使用 PropertyKeys (通常通过 keyof 创建)的联合来迭代键以创建类型:



```ts twoslash
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
```

In this example, `OptionsFlags` will take all the properties from the type `Type` and change their values to be a boolean.
在本例中，OptionsFlags 将获取 Type 类型中的所有属性，并将其值更改为布尔值。





```ts twoslash
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
// ---cut---
type FeatureFlags = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<FeatureFlags>;
//   ^?
```

### Mapping Modifiers

There are two additional modifiers which can be applied during mapping: `readonly` and `?` which affect mutability and optionality respectively.
在映射过程中可以使用两个额外的修饰符: readonly 和? ，它们分别影响可变性和可选性。



You can remove or add these modifiers by prefixing with `-` or `+`. If you don't add a prefix, then `+` is assumed.
您可以通过使用-或 + 作为前缀来删除或添加这些修饰符。如果您没有添加前缀，则假定为 + 。



```ts twoslash
// Removes 'readonly' attributes from a type's properties
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

type LockedAccount = {
  readonly id: string;
  readonly name: string;
};

type UnlockedAccount = CreateMutable<LockedAccount>;
//   ^?
```

```ts twoslash
// Removes 'optional' attributes from a type's properties
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};

type MaybeUser = {
  id: string;
  name?: string;
  age?: number;
};

type User = Concrete<MaybeUser>;
//   ^?
```

## Key Remapping via `as`

In TypeScript 4.1 and onwards, you can re-map keys in mapped types with an `as` clause in a mapped type:
在 TypeScript 4.1及以后的版本中，您可以使用映射类型中的 as 子句重新映射映射类型的键:



```ts
type MappedTypeWithNewProperties<Type> = {
    [Properties in keyof Type as NewKeyType]: Type[Properties]
}
```

You can leverage features like [template literal types](/docs/handbook/2/template-literal-types.html) to create new property names from prior ones:
你可以利用一些特性，比如模板文字类型，从以前的属性中创建新的属性名:



```ts twoslash
type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};

interface Person {
    name: string;
    age: number;
    location: string;
}

type LazyPerson = Getters<Person>;
//   ^?
```

You can filter out keys by producing `never` via a conditional type:
你可以通过一个条件类型生成 never 来过滤掉键:


```ts twoslash
// Remove the 'kind' property
type RemoveKindField<Type> = {
    [Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
};

interface Circle {
    kind: "circle";
    radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;
//   ^?
```

You can map over arbitrary unions, not just unions of `string | number | symbol`, but unions of any type:
你可以映射任意的联合，不仅仅是字符串 | 数字 | 符号的联合，而是任意类型的联合:



```ts twoslash
type EventConfig<Events extends { kind: string }> = {
    [E in Events as E["kind"]]: (event: E) => void;
}

type SquareEvent = { kind: "square", x: number, y: number };
type CircleEvent = { kind: "circle", radius: number };

type Config = EventConfig<SquareEvent | CircleEvent>
//   ^?
```

### Further Exploration

Mapped types work well with other features in this type manipulation section, for example here is [a mapped type using a conditional type](/docs/handbook/2/conditional-types.html) which returns either a `true` or `false` depending on whether an object has the property `pii` set to the literal `true`:
在这个类型操作部分，映射类型可以很好地与其他特性一起工作，例如，这里是一个使用条件类型的映射类型，根据对象的属性 pii 是否设置为文字 true，返回 true 或 false:



```ts twoslash
type ExtractPII<Type> = {
  [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
};

type DBFields = {
  id: { format: "incrementing" };
  name: { type: string; pii: true };
};

type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
//   ^?
```
