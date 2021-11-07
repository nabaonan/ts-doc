---
title: Keyof Type Operator
layout: docs
permalink: /docs/handbook/2/keyof-types.html
oneline: "Using the keyof operator in type contexts."
---

## The `keyof` type operator

The `keyof` operator takes an object type and produces a string or numeric literal union of its keys.
The following type P is the same type as "x" | "y":

Keyof 操作符接受对象类型，并生成其键的字符串或数值文字联合。下列类型 p 与“ x”| “ y”类型相同:



```ts twoslash
type Point = { x: number; y: number };
type P = keyof Point;
//   ^?
```

If the type has a `string` or `number` index signature, `keyof` will return those types instead:
注意，在这个例子中，m 是字符串 | number ー这是因为 JavaScript 对象键总是被强制为字符串，所以 obj [0]总是与 obj [“0”]相同。



```ts twoslash
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;
//   ^?

type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
//   ^?
```

Note that in this example, `M` is `string | number` -- this is because JavaScript object keys are always coerced to a string, so `obj[0]` is always the same as `obj["0"]`.

`keyof` types become especially useful when combined with mapped types, which we'll learn more about later.
当与映射类型组合时，keyof types 变得特别有用，稍后我们将对此进行更多的了解。


