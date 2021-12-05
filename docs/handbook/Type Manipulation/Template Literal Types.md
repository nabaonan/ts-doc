---
title: Template Literal Types 模板文字类型
layout: docs
permalink: /docs/handbook/2/template-literal-types.html
oneline: 'Generating mapping types which change properties via template literal strings.'
---

Template literal types build on [string literal types](/docs/handbook/2/everyday-types.html#literal-types), and have the ability to expand into many strings via unions.
模板文字类型建立在字符串文字类型之上，并且能够通过联合扩展成许多字符串。

They have the same syntax as [template literal strings in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), but are used in type positions.
When used with concrete literal types, a template literal produces a new string literal type by concatenating the contents.
它们与 JavaScript 中的模板字符串具有相同的语法，但是用于类型位置。当与具体文本类型一起使用时，模板文本通过连接内容生成一个新的字符串文本类型。

```ts twoslash
type World = 'world';

type Greeting = `hello ${World}`;
//   ^?
```

When a union is used in the interpolated position, the type is the set of every possible string literal that could be represented by each union member:
当在插值位置使用联合时，类型是每个联合成员可以表示的每个可能的字符串文字的集合:

```ts twoslash
type EmailLocaleIDs = 'welcome_email' | 'email_heading';
type FooterLocaleIDs = 'footer_title' | 'footer_sendoff';

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
//   ^?
```

For each interpolated position in the template literal, the unions are cross multiplied:
对于模板文字中的每个插值位置，联合是十字乘:

```ts twoslash
type EmailLocaleIDs = 'welcome_email' | 'email_heading';
type FooterLocaleIDs = 'footer_title' | 'footer_sendoff';
// ---cut---
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
type Lang = 'en' | 'ja' | 'pt';

type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;
//   ^?
```

We generally recommend that people use ahead-of-time generation for large string unions, but this is useful in smaller cases.
我们通常建议人们对大型字符串联合使用提前生成，但这在小型情况下很有用。

### String Unions in Types 类型字符串联合

The power in template literals comes when defining a new string based off an existing string inside a type.
当基于类型中的现有字符串定义新字符串时，模板字符的威力就来了。

For example, a common pattern in JavaScript is to extend an object based on the fields that it currently has. We'll provide a type definition for a function which adds support for an `on` function which lets you know when a value has changed:
例如，JavaScript 中的一个常见模式是基于对象当前拥有的字段扩展对象。我们将为一个函数提供一个类型定义，该函数增加了对 on 函数的支持，可以让你知道一个值什么时候发生了变化:

```ts twoslash
// @noErrors
declare function makeWatchedObject(obj: any): any;
// ---cut---
const person = makeWatchedObject({
  firstName: 'Saoirse',
  lastName: 'Ronan',
  age: 26,
});

person.on('firstNameChanged', (newValue) => {
  console.log(`firstName was changed to ${newValue}!`);
});
```

Notice that `on` listens on the event `"firstNameChanged"`, not just `"firstName"`, template literals provide a way to handle this sort of string manipulation inside the type system:
注意，在监听事件“ firstNameChanged”时，不仅仅是“ firstName”，模板文本提供了一种在类型系统中处理这种类型的字符串操作的方法:

```ts twoslash
type PropEventSource<Type> = {
  on(
    eventName: `${string & keyof Type}Changed`,
    callback: (newValue: any) => void
  ): void;
};

/// Create a "watched object" with an 'on' method
/// so that you can watch for changes to properties.
declare function makeWatchedObject<Type>(
  obj: Type
): Type & PropEventSource<Type>;
```

With this, we can build something that errors when given the wrong property:

有了这个，我们就可以构建一些在给出错误属性时会出错的东西:

```ts twoslash
// @errors: 2345
type PropEventSource<Type> = {
  on(
    eventName: `${string & keyof Type}Changed`,
    callback: (newValue: any) => void
  ): void;
};

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;
// ---cut---
const person = makeWatchedObject({
  firstName: 'Saoirse',
  lastName: 'Ronan',
  age: 26,
});

person.on('firstNameChanged', () => {});

// Prevent easy human error (using the key instead of the event name)
person.on('firstName', () => {});

// It's typo-resistant
person.on('frstNameChanged', () => {});
```

### Inference with Template Literals 使用模板文字进行推理

Note how the last examples did not re-use the type of the original value. The callback used an `any`. Template literal types can infer from substitution positions.
请注意最后的示例如何没有重用原始值的类型。回调函数使用了 any。模板文字类型可以从替换位置推断。

We can make our last example generic to infer from parts of the `eventName` string to figure out the associated property.
我们可以使我们的最后一个示例成为泛型，从 eventName 字符串的各个部分推断出关联的属性。

```ts twoslash
type PropEventSource<Type> = {
  on<Key extends string & keyof Type>(
    eventName: `${Key}Changed`,
    callback: (newValue: Type[Key]) => void
  ): void;
};

declare function makeWatchedObject<Type>(
  obj: Type
): Type & PropEventSource<Type>;

const person = makeWatchedObject({
  firstName: 'Saoirse',
  lastName: 'Ronan',
  age: 26,
});

person.on('firstNameChanged', (newName) => {
  //                        ^?
  console.log(`new name is ${newName.toUpperCase()}`);
});

person.on('ageChanged', (newAge) => {
  //                  ^?
  if (newAge < 0) {
    console.warn('warning! negative age');
  }
});
```

Here we made `on` into a generic method.
在这里，我们进入了一个通用方法。

When a user calls with the string `"firstNameChanged'`, TypeScript will try to infer the right type for `Key`.
To do that, it will match `Key` against the content prior to `"Changed"` and infer the string `"firstName"`.
Once TypeScript figures that out, the `on` method can fetch the type of `firstName` on the original object, which is `string` in this case.
Similarly, when called with `"ageChanged"`, TypeScript finds the type for the property `age` which is `number`.
当用户使用字符串“ firstnamecchanged”调用时，TypeScript 将尝试推断 Key 的正确类型。为此，它将键与“ Changed”之前的内容进行匹配，并推断字符串“ firstName”。一旦 TypeScript 发现了这一点，on 方法就可以获取原始对象的 firstName 类型，在本例中是 string。类似地，当使用“ agecchanged”调用时，TypeScript 会查找属性年龄的类型，即 number。

Inference can be combined in different ways, often to deconstruct strings, and reconstruct them in different ways.
推理可以以不同的方式组合，通常用于解构字符串，并以不同的方式重构它们。

## Intrinsic String Manipulation Types 内部字符串操作类型

To help with string manipulation, TypeScript includes a set of types which can be used in string manipulation. These types come built-in to the compiler for performance and can't be found in the `.d.ts` files included with TypeScript.
为了帮助进行字符串操作，TypeScript 包含了一组可用于字符串操作的类型。这些类型是编译器内置的，用于提高性能，在。打字稿中包含的 d.ts 文件。

### `Uppercase<StringType>`

Converts each character in the string to the uppercase version.
将字符串中的每个字符转换为大写版本。

##### Example

```ts twoslash
type Greeting = 'Hello, world';
type ShoutyGreeting = Uppercase<Greeting>;
//   ^?

type ASCIICacheKey<Str extends string> = `ID-${Uppercase<Str>}`;
type MainID = ASCIICacheKey<'my_app'>;
//   ^?
```

### `Lowercase<StringType>`

Converts each character in the string to the lowercase equivalent.
将字符串中的每个字符转换为等效的小写形式。

##### Example

```ts twoslash
type Greeting = 'Hello, world';
type QuietGreeting = Lowercase<Greeting>;
//   ^?

type ASCIICacheKey<Str extends string> = `id-${Lowercase<Str>}`;
type MainID = ASCIICacheKey<'MY_APP'>;
//   ^?
```

### `Capitalize<StringType>`

Converts the first character in the string to an uppercase equivalent.
将字符串中的第一个字符转换为等效的大写字母。

##### Example

```ts twoslash
type LowercaseGreeting = 'hello, world';
type Greeting = Capitalize<LowercaseGreeting>;
//   ^?
```

### `Uncapitalize<StringType>`

Converts the first character in the string to a lowercase equivalent.
将字符串中的第一个字符转换为等效的小写形式。

##### Example

```ts twoslash
type UppercaseGreeting = 'HELLO WORLD';
type UncomfortableGreeting = Uncapitalize<UppercaseGreeting>;
//   ^?
```

<details>
    <summary>Technical details on the intrinsic string manipulation types</summary>
    <p>The code, as of TypeScript 4.1, for these intrinsic functions uses the JavaScript string runtime functions directly for manipulation and are not locale aware.</p>
    <code><pre>
function applyStringMapping(symbol: Symbol, str: string) {
    switch (intrinsicTypeKinds.get(symbol.escapedName as string)) {
        case IntrinsicTypeKind.Uppercase: return str.toUpperCase();
        case IntrinsicTypeKind.Lowercase: return str.toLowerCase();
        case IntrinsicTypeKind.Capitalize: return str.charAt(0).toUpperCase() + str.slice(1);
        case IntrinsicTypeKind.Uncapitalize: return str.charAt(0).toLowerCase() + str.slice(1);
    }
    return str;
}</pre></code>
</details>
