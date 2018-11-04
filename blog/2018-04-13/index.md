---
date: "2018-04-13"
title: "Java vararg constructors and reflection"
category: "Programming"
---

On a recent Selenium project, I was trying to develop tests for a page with a long, dynamic form. This form has several types, with some shared fields across each type, with the number of possible fields ranging around 30-50 fields.

### 50 String parameter test methods

For testing this form, I didn't want to have a test method that took in 50 string parameters, since that would be very unwieldy and error-prone. Instead, I decided to create an object model of each form type, with each form type inheriting from a super class that contained all the required fields. Then, I could simply pass in a single parameter, the form object, and then just inquire of the object when I wanted the value for a particular field.

This meant that instead of my method looking like this:

```java
public void formTest(String foo, String bar, String baz, String buzz){
    inputValueForFoo(foo);
    inputValueForBar(bar);
    inputValueForBaz(baz);
    inputValueForBuzz(buzz);
}
```

it instead looked something like the following:

```java
public void formTest(FormType1 form){
    inputValueForFoo(form.getFoo());
    inputValueForBar(form.getBar());
    inputValueForBaz(form.getBaz());
    inputValueForBuzz(form.getBuzz());
}
```

which was already a bit better than before. This also resolves the issue of Java not having optional or default parameter values. For instance, if I only used methods that took in strings, then I couldn't have the following two methods since they share the same signature:

```java
public void formTest(String foo, String bar){
  /* Constructor stuff here */
}

public void formTest(String foo, String baz){
  /* Constructor stuff here */
}
```

If I stuck with just using string parameters, I would need to be extremely careful about the position of the arguments being passed in to the function. As well, if I wanted to test only a few fields, I would still need to pass in values for all the fields up until that point.

For instance, if I wanted to only set *foo* and *buzz*, I couldn't have a method that just took in two strings, since that signature would already be reserved for the method that takes in *foo* and *bar*. I would instead need to pass in values for bar, and baz in order to get to the positional argument for *buzz*. Not a very maintainable solution in the long run.


### 50 String Parameter Constructors

At this point, I felt as though I had just shuffled the complexity around. I now had my test method that took in a single parameter, but it required building a specific an instance of whichever form type I wanted to test, which would take in a variable number of string arguments and create the object.

The problem with this approach was that I would need a constructor for every number of fields such as:

```java
public FormType(String foo){
    this.foo = foo;
}

public FormType(String foo, String baz){
    this.foo = foo;
    this.baz = baz;
}

public FormType(String foo, String baz, String bar){
    this.foo = foo;
    this.baz = baz;
    this.bar = bar;
}

public FormType(String foo, String baz, String bar, String buzz){
    this.foo = foo;
    this.baz = baz;
    this.bar = bar;
    this.buzz = buzz;
}
```

And this logic would need to be repeated for every form type. Since I have about 8 different form types, that would mean 8 * 50 = 400 constructors spread across 8 class files, along with the constructors in the super class. Not really any easier, or more maintainable.

### Vararg Constructors

To cut down on the number of constructors, I decided to try implementing a [varargs](https://docs.oracle.com/javase/8/docs/technotes/guides/language/varargs.html) constructor. Java allows for passing in a variable number of arguments using the ... syntax like so:

```java
public Polygon polygonFrom(Point... corners) {
    int numberOfSides = corners.length;
    double squareOfSide1, lengthOfSide1;
    squareOfSide1 = (corners[1].x - corners[0].x)
                     * (corners[1].x - corners[0].x)
                     + (corners[1].y - corners[0].y)
                     * (corners[1].y - corners[0].y);
    lengthOfSide1 = Math.sqrt(squareOfSide1);
}
```

which means that instead of having 50 different constructors, we could have just one. However, one of the tradeoffs of using varargs (which in our case is just an array of strings) is that we can't rely on knowing ahead of time how many arguments will be passed in. This means that the following code block could end up throwing an OutOfBoundsException:

```java
public FormType(String... values){
    this.foo = values[0];
    this.baz = values[1];
    this.bar = values[2];
    this.buzz = values[3];
}
```

Normally in a method that takes varargs, we perform the same action on each parameter using a **forEach** loop, such as in the case of printf, which takes a variable number of arguments and prints them. But since we're wanting to assign member variables, we can't handle these varargs in a **forEach** loop. Instead, the way I ended up dealing with the varargs ended up being pretty messy, but it (more or less) worked:


```java
public FormType(String... values){

    List<String> valueList = Arrays.asList(valueList);

    while (!valueList.isEmpty()){
        this.foo = valueList.get(0);

        valueList.remove(0);
        if (valueList.isEmpty()){
            break;
        }

        this.baz = valueList.get(0);

        valueList.remove(0);
        if (valueList.isEmpty()){
            break;
        }

        this.bar = valueList.get(0);

        valueList.remove(0);
        if (valueList.isEmpty()){
            break;
        }

        this.buzz = valueList.get(0);

        /*... And so on for every member variable.*/

        break;
    }
}
```

Now, most of the constructors were able to be replaced with this single "varargs constructor". I still wasn't happy though - it seemed like a terribly ugly and inefficient solution. However, the advantage to having this constructor was that if there was a problem with the order in which the strings were being passed in, I would be able to check inside of this single constructor, instead of searching through dozens of similar-looking constructors.


### Reflection rescue


Since I wanted to be able to choose the form type at test runtime, I was using reflection to find the appropriate class constructor. This means that we can pass in a string variable and find the class that has that name. Using the [MethodHandles Java API](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/MethodHandles.html), we can get the constructor of any class and instantiate a new object of that class at runtime.

At this point, I somewhat embarrassedly showed my code to one of my colleagues and asked if he knew of a better way to do what I was trying to accomplish. He pointed out that you could not only call a constructor through reflection, but also the getters and the setters inside a class.

```java
FormType form = new FormType();
PropertyDescriptor pd = new PropertyDescriptor("field", FormType.class);
Method setter = pd.getWriteMethod();
setter.invoke(form, value);
```

This simplified things *immensely* for me.

The way I was passing in the test data was by parsing rows out of an Excel spreadsheet. By setting the column headers to the same name as the member variables, I could find the appropriate setter for each field using reflection. I could remove the hideous "varargs constructor" and instead just have an empty constructor. Then, I could set each member variable using the dedicated setter for that variable.

Now, when parsing the Excel spreadsheet, I create an ArrayList of all the headers. For each row, I call the no-args constructor, and for each cell value, I find the setter for that column through reflection by passing in the value from the header.

So much simpler, and it means that my 8 classes with 50 constructors has finally become a single class with a single constructor, and setter/getter pair for each possible form field.