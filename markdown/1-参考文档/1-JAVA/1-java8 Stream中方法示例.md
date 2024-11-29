# java8 Stream中方法示例

## 1. Stream\<T\> filter(Predicate\<? super T\> predicate);

用于对流中的元素进行筛选。这个方法接受一个 Predicate 作为参数，Predicate 是一个函数式接口，它定义了一个条件，返回 true 的元素会被保留在结果流中，返回 false 的元素会被过滤掉。

```java
public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        // 使用 filter 过滤出偶数
        List<Integer> evenNumbers = numbers.stream()
                                           .filter(n -> n % 2 == 0)
                                           .collect(Collectors.toList());

        // 打印结果
        System.out.println("偶数列表: " + evenNumbers);
    }
```

## 2. \<R\> Stream\<R\> map(Function\<? super T, ? extends R\> mapper);

用于将流中的每个元素应用一个函数（Function），并将结果转换为一个新的流。这个方法通常用于将流中的元素转换为另一种类型，或对每个元素进行某种操作。

```java
public class Person {
    private String name;
    private int age;
    private String email;
    ......
}
public static void main(String[] args) {
        // 创建 Person 对象的列表
        List<Person> people = Arrays.asList(
                new Person("Alice", 30, "alice@example.com"),
                new Person("Bob", 25, "bob@example.com"),
                new Person("Charlie", 35, "charlie@example.com")
        );

        // 使用 map 提取每个人的姓名
        List<String> names = people.stream()
                                   .map(Person::getName)
                                   .collect(Collectors.toList());

        // 打印结果
        System.out.println("姓名列表: " + names);
    }  
```

## 3. IntStream mapToInt(ToIntFunction\<? super T\> mapper);

这个方法通常用于需要将流中的元素转换成基本类型 int 值的场景  
LongStream mapToLong(ToLongFunction\<? super T\> mapper);类似于int  
DoubleStream mapToDouble(ToDoubleFunction\<? super T\> mapper);类似于int

```java
class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public int getAge() {
        return age;
    }
}

public class Main {
    public static void main(String[] args) {
        List<Person> people = Arrays.asList(
            new Person("Alice", 30),
            new Person("Bob", 25),
            new Person("Charlie", 35)
        );

        IntStream ageStream = people.stream()
                                    .mapToInt(Person::getAge);

        ageStream.forEach(System.out::println);
        System.out.println(ageStream.sum()); // 计算年龄的和
        System.out.println(ageStream.average().orElse(0)); // 计算年龄的平均值
        System.out.println(ageStream.min().orElse(0)); // 计算年龄的最小值
        System.out.println(ageStream.max().orElse(0)); // 计算年龄的最大值
        System.out.println(ageStream.count()); // 计算年龄的数量
    }
}
```

## 4. \<R\> Stream\<R\> flatMap(Function\<? super T, ? extends Stream\<? extends R\>\> mapper);

它用于将流的每个元素转换成另一个流，然后将所有流连接成一个流。这是一种“扁平化”的过程，即将多个流合并成一个流。  
方法解释：  
返回类型： Stream\<R\> 表示该方法返回的是一个流。  
方法名称： flatMap 指定了该方法的行为，即“扁平映射”。  
参数： Function\<? super T, ? extends Stream\<? extends R\>\> mapper  
T 是当前流中元素的类型。  
R 是经过映射后流中元素的类型。  
mapper 是一个函数，它接受一个类型为 T 的参数，并返回一个类型为 Stream\<? extends R> 的流。  
flatMap 方法将提供的映射函数应用于当前流中的每个元素，并将返回的每个流的所有元素组成一个新的流。这样，你就可以将多个流合并成一个流，而不是得到一个流的流（即 Stream<Stream\<R\>>）。

```java
 public static void main(String[] args) {
        // 创建一个包含多个字符串的列表
        List<String> list = Arrays.asList("Hello World", "Java 8 Stream", "FlatMap Example");

        // 使用 flatMap 将每个字符串转换为单词流，并收集到一个列表中
        List<String> words = list.stream()
                                 .flatMap(s -> Stream.of(s.split(" ")))
                                 .collect(Collectors.toList());

        // 输出结果
        words.forEach(System.out::println);
    }
```

```java
public class Person {
    private String name;
    private List<String> favoriteMovies;

    public Person(String name, List<String> favoriteMovies) {
        this.name = name;
        this.favoriteMovies = favoriteMovies;
    }

    public String getName() {
        return name;
    }

    public List<String> getFavoriteMovies() {
        return favoriteMovies;
    }
}
public static void main(String[] args) {
        // 创建一个包含 Person 实例的列表
        List<Person> people = Arrays.asList(
            new Person("Alice", Arrays.asList("Inception", "Interstellar")),
            new Person("Bob", Arrays.asList("The Matrix", "The Lord of the Rings")),
            new Person("Charlie", Arrays.asList("The Social Network", "The Dark Knight"))
        );

        // 使用 flatMap 提取所有喜欢的电影名字，并收集到一个列表中
        List<String> allFavoriteMovies = people.stream()
                                               .flatMap(person -> person.getFavoriteMovies().stream())
                                               .collect(Collectors.toList());

        // 输出结果
        allFavoriteMovies.forEach(System.out::println);
    }
```

## 5. IntStream flatMapToInt(Function\<? super T, ? extends IntStream\> mapper);

它用于将流的每个元素转换成一个 IntStream，然后将所有这些 IntStream 合并成一个 IntStream。这是处理原始类型 int 的一种高效方式，因为它避免了自动装箱和拆箱，从而提高了性能。

方法解释：  
返回类型： IntStream 表示该方法返回的是一个原始类型 int 的流。  
方法名称： flatMapToInt 指定了该方法的行为，即“扁平映射到 IntStream”。  
参数： Function\<? super T, ? extends IntStream\> mapper  
T 是当前流中元素的类型。  
mapper 是一个函数，它接受一个类型为 T 的参数，并返回一个类型为 IntStream 的流。  
flatMapToInt 方法将提供的映射函数应用于当前流中的每个元素，并将返回的每个 IntStream 的所有元素组成一个新的 IntStream。

```java
 public static void main(String[] args) {
        // 创建一个包含数字字符串的列表
        List<String> numbersList = Arrays.asList("1,2,3", "4,5", "6");

        // 使用 flatMapToInt 将每个字符串分割成数字，并转换成 IntStream
        IntStream intStream = numbersList.stream()
                                         .flatMapToInt(s -> IntStream.of(Arrays.stream(s.split(","))
                                                                              .mapToInt(Integer::parseInt)));

        // 将 IntStream 转换为 List<Integer> 并打印
        List<Integer> numbers = intStream.boxed().collect(Collectors.toList());
        numbers.forEach(System.out::println);
    }
```

## 6. Stream\<T\> distinct();

它会返回一个由该流中不同元素组成的流。更具体地说，它会按照 Object.equals(Object) 方法来判断两个对象是否相等，并去除重复的元素。返回的流按照遭遇（encounter）顺序排序，即保持原始流中首次出现的元素顺序。

方法解释：  
返回类型： Stream\<T\> 表示该方法返回一个流，其中包含原始流中的不同元素。  
方法名称： distinct 指定了该方法的行为，即去除流中的重复元素。  
注意事项：  
distinct() 方法依赖于元素的 equals() 和 hashCode() 方法来确定元素是否相等。因此，确保你流中的元素正确地实现了这两个方法是很重要的。  
使用 distinct() 方法可能会导致性能问题，因为它需要存储遇到的元素以检查重复项，这在处理大量数据时可能会导致较高的内存消耗。

```java
public static void main(String[] args) {
        // 创建一个包含重复元素的列表
        List<Integer> numbers = Arrays.asList(1, 2, 2, 3, 4, 4, 5);

        // 使用 distinct() 去除重复元素，并将结果收集到一个新的列表中
        List<Integer> distinctNumbers = numbers.stream()
                                               .distinct()
                                               .collect(Collectors.toList());

        // 输出结果
        System.out.println(distinctNumbers);
    }
```

## 7. Stream\<T\> sorted();Stream\<T\> sorted(Comparator\<? super T\> comparator);

它会返回一个按照自然顺序排序（或根据提供的比较器进行排序）的流。如果没有指定比较器，则默认使用 Comparable 接口定义的自然顺序。

方法解释：  
返回类型： Stream\<T\> 表示该方法返回一个流，其中元素已根据某种顺序排序。  
方法名称： sorted 指定了该方法的行为，即对流中的元素进行排序。  
注意事项：  
如果流中的元素没有实现 Comparable 接口，或者你想要使用自定义的排序顺序，你可以使用 sorted(Comparator\<? super T\> comparator) 方法并提供一个自定义的比较器。  
sorted() 方法是一个懒惰的操作，它不会立即对元素进行排序，而是在进行终端操作（如 collect()、forEach() 等）时才进行排序。  
对流进行排序可能会导致性能问题，特别是当处理大量数据时。

```java
public static void main(String[] args) {
        // 创建一个字符串列表
        List<String> words = Arrays.asList("banana", "apple", "cherry", "date");

        // 使用 sorted() 对字符串列表进行自然排序，并将结果收集到一个新的列表中
        List<String> sortedWords = words.stream()
                                        .sorted()
                                        .collect(Collectors.toList());

        // 输出结果
        System.out.println(sortedWords);
    }
  
// 按照不同的顺序排序，例如按照字符串长度排序，你可以提供一个自定义的比较器：
public static void main(String[] args) {
        // 创建一个字符串列表
        List<String> words = Arrays.asList("banana", "apple", "cherry", "date");

        // 使用 sorted() 和自定义比较器对字符串列表按照长度排序，并将结果收集到一个新的列表中
        List<String> sortedWordsByLength = words.stream()
                                                 .sorted(Comparator.comparingInt(String::length))
                                                 .collect(Collectors.toList());

        // 输出结果
        System.out.println(sortedWordsByLength);
    }  
```

## 8. Stream\<T\> peek(Consumer\<? super T\> action);

它允许你在不修改流的情况下，对流中的每个元素执行一个操作。这个操作通常用于调试目的，因为它可以让你查看流在处理过程中的中间状态。

方法解释：  
返回类型： Stream\<T\> 表示该方法返回一个流，它包含了原始流中的所有元素，并且在每个元素上执行了提供的操作。  
方法名称： peek 指定了该方法的行为，即在流的每个元素上执行一个操作，但不改变元素本身。  
参数： Consumer\<? super T\> action 是一个消费者函数，它接受一个类型为 T（或 T 的超类型）的参数，并执行一些操作（例如打印元素），但不返回任何结果。  
注意事项：  
peek() 方法不会改变流中的元素，它只是对每个元素执行了一个副作用操作。  
peek() 方法在并行流（parallel stream）中可能会表现出不可预测的行为，因为并行流中的元素可能以任何顺序处理。  
peek() 方法通常用于调试，因为它可以让你在不中断流处理的情况下观察流的状态。

```java
public static void main(String[] args) {
        // 创建一个整数列表
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        // 使用 peek() 在每个元素上执行打印操作，然后对元素进行平方，并将结果收集到一个新的列表中
        List<Integer> squaredNumbers = numbers.stream()
                                              .peek(n -> System.out.println("Original: " + n))
                                              .map(n -> n * n)
                                              .peek(n -> System.out.println("Squared: " + n))
                                              .collect(Collectors.toList());

        // 输出最终结果
        System.out.println("Squared numbers: " + squaredNumbers);
    }
```

## 9. Stream\<T\> limit(long maxSize);

它会返回一个新的流，该流包含原始流中的前 maxSize 个元素。如果原始流的长度小于 maxSize，则返回原始流本身。

方法解释：  
返回类型： Stream\<T\> 表示该方法返回一个流，它可能包含原始流中的前 maxSize 个元素。  
方法名称： limit 指定了该方法的行为，即限制流中元素的数量。  
参数： long maxSize 是一个长整型参数，表示返回流中可以包含的最大元素数量。  
注意事项：  
当 maxSize 小于或等于零时，limit() 方法将返回一个空的流。  
在并行流（parallel stream）中，limit() 可能会提供性能优势，因为它可以在达到 maxSize 后停止处理更多的元素。  
limit() 方法是短路的，这意味着它可以在达到指定的元素数量后停止处理原始流中的其他元素。

```java
public static void main(String[] args) {
        // 创建一个整数列表
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        // 使用 limit() 获取前三个元素，并将结果收集到一个新的列表中
        List<Integer> firstThreeNumbers = numbers.stream()
                                                 .limit(3)
                                                 .collect(Collectors.toList());

        // 输出结果
        System.out.println(firstThreeNumbers);
    }
```

## 10. Stream\<T\> skip(long n);

它会返回一个新的流，该流包含原始流中跳过前 n 个元素之后的所有元素。如果原始流的长度小于或等于 n，则返回一个空的流。

方法解释：  
返回类型： Stream\<T\> 表示该方法返回一个流，它包含原始流中跳过前 n 个元素之后的所有元素。  
方法名称： skip 指定了该方法的行为，即跳过流中的前 n 个元素。  
参数： long n 是一个长整型参数，表示要跳过的元素数量。  
注意事项：  
当 n 小于或等于零时，skip() 方法将返回原始流本身。  
在并行流（parallel stream）中，skip() 可能会提供性能优势，因为它可以在跳过指定数量的元素后开始处理剩余的元素。  
skip() 方法是短路的，这意味着它可以在跳过指定的元素数量后停止处理原始流中的其他元素

```java
 public static void main(String[] args) {
        // 创建一个整数列表
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        // 使用 skip() 跳过前三个元素，并将剩余的元素收集到一个新的列表中
        List<Integer> remainingNumbers = numbers.stream()
                                                .skip(3)
                                                .collect(Collectors.toList());

        // 输出结果
        System.out.println(remainingNumbers);
    }
```

## 11. void forEach(Consumer\<? super T\> action);

它会对流中的每个元素执行给定的操作。这个操作通常用于处理流中的每个元素，例如打印、修改元素或者执行一些其他操作。

方法解释：  
返回类型： void 表示该方法不返回任何值，它只是对流的每个元素执行一个操作。  
方法名称： forEach 指定了该方法的行为，即遍历流中的每个元素并对其执行一个操作。  
参数： Consumer\<? super T\> action 是一个消费者函数，它接受一个类型为 T（或 T 的超类型）的参数，并执行一些操作（例如打印元素），但不返回任何结果。  
注意事项：  
forEach() 方法在执行完毕后不返回任何值，它只是用来处理流中的元素。  
forEach() 方法在并行流（parallel stream）中可能会以任意顺序执行操作，因此它不应该用于执行依赖于元素顺序的操作。  
如果操作涉及到共享资源或者有状态的操作，需要确保这些操作是线程安全的，特别是当在并行流中使用时。

```java
public static void main(String[] args) {
        // 创建一个整数列表
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        // 使用 forEach() 遍历列表中的每个元素并打印
        numbers.stream()
                .forEach(System.out::println);
    }
```

## 12. void forEachOrdered(Consumer\<? super T\> action);

它会对流中的每个元素执行给定的操作，并且保证按照流中元素的原始顺序（encounter order）来执行这些操作。这与 forEach() 方法不同，后者在并行流（parallel stream）中可能会以任意顺序执行操作。

方法解释：  
返回类型： void 表示该方法不返回任何值，它只是对流的每个元素按照原始顺序执行一个操作。  
方法名称： forEachOrdered 指定了该方法的行为，即按照流中元素的原始顺序遍历每个元素并对其执行一个操作。  
参数： Consumer\<? super T\> action 是一个消费者函数，它接受一个类型为 T（或 T 的超类型）的参数，并执行一些操作（例如打印元素），但不返回任何结果。  
注意事项：  
forEachOrdered() 方法在执行完毕后不返回任何值，它只是用来处理流中的元素。  
forEachOrdered() 方法即使在并行流中也会按照元素在流中的原始顺序执行操作，但这可能会降低并行处理的性能。  
如果操作涉及到共享资源或者有状态的操作，需要确保这些操作是线程安全的。

```java
public static void main(String[] args) {
        // 创建一个整数列表
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        // 使用 parallelStream() 转换为并行流，然后使用 forEachOrdered() 按照原始顺序遍历并打印每个元素
        numbers.parallelStream()
                .forEachOrdered(System.out::println);
    }
```

## 13. Object[] toArray();

它将流中的元素收集到一个新的数组中。这个方法返回一个包含流中所有元素的 Object 类型的数组。

方法解释：  
返回类型： Object[] 表示该方法返回一个对象数组，该数组包含流中的所有元素。  
方法名称： toArray 指定了该方法的行为，即将流中的元素转换成数组。  
注意事项：  
如果流中的元素是原始类型（如 int、long 等），则可以使用更具体的 toArray() 方法变体（例如 int[] toArray()），这样可以避免自动装箱和拆箱的开销。  
返回的数组中的元素类型是 Object，这意味着如果流中的元素是原始类型的包装类（如 Integer、Long 等），它们将被自动装箱到对应的包装类对象。

```java
 public static void main(String[] args) {
        // 创建一个字符串列表
        List<String> words = Arrays.asList("Hello", "World", "Java", "Stream");

        // 使用 stream() 将列表转换为流，然后使用 toArray() 将流中的元素收集到对象数组中
        Object[] wordArray = words.stream().toArray();

        // 输出结果
        System.out.println(Arrays.toString(wordArray));
    }
```

## 14. \<A\> A[] toArray(IntFunction\<A[]\> generator);

，它将流中的元素收集到一个新数组中，这个数组是由提供的生成器函数创建的，其类型由泛型参数 A 指定。这种方法允许你指定返回数组的类型，从而避免了自动装箱和拆箱的开销。

方法解释：  
返回类型： A[] 表示该方法返回一个指定类型 A 的数组，该数组包含流中的所有元素。  
方法名称： toArray 指定了该方法的行为，即将流中的元素转换成数组。  
参数： IntFunction\<A[]\> generator 是一个函数，它接受一个整数参数（表示所需数组的长度），并返回一个指定类型 A 的数组。  
注意事项：  
使用 toArray(IntFunction\<A[]\> generator) 方法时，你需要提供一个生成器函数，该函数能够根据所需数组的长度创建一个正确类型的数组。  
这种方法比直接使用 toArray() 更高效，特别是当你知道数组的确切类型时，因为它避免了自动装箱和拆箱。

```java
 public static void main(String[] args) {
        // 创建一个整数列表
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        // 使用 stream() 将列表转换为流，然后使用 toArray() 和生成器函数将流中的元素收集到 Integer 数组中
        Integer[] integerArray = numbers.stream()
                                        .toArray(Integer[]::new); // 生成器函数

        // 输出结果
        System.out.println(Arrays.toString(integerArray));
    }
```

## 15. T reduce(T identity, BinaryOperator\<T\> accumulator);

它用于将流中的元素减少（reduce）成一个单一的值。这个操作通常用于将流中的元素通过某种操作合并成一个单一的结果。

方法解释：  
返回类型： T 表示该方法返回一个单一的值，这个值是流中所有元素通过指定的操作合并而成的。  
方法名称： reduce 指定了该方法的行为，即将流中的元素通过某种操作合并成一个单一的结果。  
参数：  
T identity：初始值，它被用作累加器的初始输入。如果流为空，这个初始值将作为最终结果返回。  
BinaryOperator\<T\> accumulator：累加器函数，它接受两个输入参数（累加器当前的值和流中的下一个元素），并返回一个新的累加器值。这个函数需要是可变参数的，以便它可以接受任意数量的参数。  
注意事项：  
reduce() 方法返回一个单一的值，这个值是流中所有元素通过累加器函数合并而成的。  
如果流为空，则 identity 参数的值将被返回。  
如果流中只有一个元素，则这个元素将被直接返回。  
如果流中有多个元素，则累加器函数将被应用到流中的每个元素上，最终返回一个单一的值。

```java
public static void main(String[] args) {
        // 创建一个整数列表
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        // 使用 reduce() 将列表中的元素通过求和操作合并成一个单一的值
        Optional<Integer> sum = numbers.stream()
                                        .reduce(Integer::sum);

        // 输出结果
        sum.ifPresent(System.out::println);
    }
```

## 16. Optional\<T\> reduce(BinaryOperator\<T\> accumulator);

它用于将流中的元素通过一个累加器函数（accumulator）合并成一个单一的结果。这个操作返回一个 Optional\<T\> 对象，该对象包含合并后的结果，如果流为空，则返回一个空的 Optional。

方法解释：  
返回类型： Optional\<T\> 表示该方法返回一个包含合并结果的 Optional 对象。  
方法名称： reduce 指定了该方法的行为，即将流中的元素通过累加器函数合并成一个单一的结果。  
参数： BinaryOperator\<T\> accumulator：一个累加器函数，它接受两个输入参数（累加器当前的值和流中的下一个元素），并返回一个新的累加器值。  
注意事项：  
如果流为空，则 reduce() 方法返回一个空的 Optional。  
如果流中只有一个元素，则这个元素将被直接返回。  
如果流中有多个元素，则累加器函数将被应用到流中的每个元素上，最终返回一个单一的值。

```java
public static void main(String[] args) {
        // 创建一个 Person 类的实例列表
        List<Person> people = Arrays.asList(
            new Person("Alice", 30),
            new Person("Bob", 25),
            new Person("Charlie", 35)
        );

        // 使用 reduce() 将列表中的 Person 实例的年龄通过求和操作合并成一个单一的值
        Optional<Integer> totalAge = people.stream()
                                            .reduce(0, (sum, person) -> sum + person.getAge());

        // 输出结果
        totalAge.ifPresent(System.out::println);
    }
}

class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }
```

## 17. \<U\> U reduce(U identity, BiFunction\<U, ? super T, U\> accumulator, BinaryOperator\<U\> combiner);

它用于将流中的元素通过一个累加器函数（accumulator）和一个合并器函数（combiner）合并成一个单一的结果。这个操作返回一个包含合并结果的 U 类型的对象。

方法解释：  
返回类型： U 表示该方法返回一个包含合并结果的 U 类型的对象。  
方法名称： reduce 指定了该方法的行为，即将流中的元素通过累加器函数和合并器函数合并成一个单一的结果。  
参数：  
U identity：初始值，它被用作累加器的初始输入。如果流为空，这个初始值将作为最终结果返回。  
BiFunction\<U, ? super T, U\> accumulator：累加器函数，它接受三个输入参数（累加器当前的值、流中的下一个元素和累加器的初始值），并返回一个新的累加器值。这个函数需要是可变参数的，以便它可以接受任意数量的参数。  
BinaryOperator\<U\> combiner：合并器函数，它接受两个输入参数（两个并行流中累加器函数的结果），并返回一个新的累加器值。这个函数用于在并行流中合并结果。  
注意事项：  
reduce() 方法返回一个单一的值，这个值是流中所有元素通过累加器函数和合并器函数合并而成的。  
如果流为空，则 identity 参数的值将被返回。  
如果流中只有一个元素，则这个元素将被直接返回。  
如果流中有多个元素，则累加器函数将被应用到流中的每个元素上，最终返回一个单一的值。

```java
public static void main(String[] args) {
        // 创建一个整数列表
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        // 使用 reduce() 将列表中的元素通过求和操作合并成一个单一的结果
        Optional<Integer> sum = numbers.stream()
                                        .reduce(0, (sum, number) -> sum + number, Integer::sum);

        // 输出结果
        sum.ifPresent(System.out::println);
    }
```

## 18. \<R\> R collect(Supplier\<R\> supplier, BiConsumer\<R, ? super T\> accumulator, BiConsumer\<R, R\> combiner);

它用于将流中的元素收集到一个容器中，这个容器由 supplier 函数创建，并且使用 accumulator 和 combiner 函数来处理元素。

方法解释：  
返回类型： R 表示该方法返回一个容器，其中包含流中所有元素经过处理后的结果。  
方法名称： collect 指定了该方法的行为，即将流中的元素收集到由 supplier 函数创建的容器中，并使用 accumulator 和 combiner 函数来处理元素。  
参数：  
Supplier\<R\> supplier：一个提供者函数，它创建一个容器来存储收集的结果。  
BiConsumer\<R, ? super T\> accumulator：累加器函数，它接受两个输入参数（累加器当前的值和流中的下一个元素），并执行一些操作（例如添加元素到容器）。  
BiConsumer\<R, R\> combiner：合并器函数，它接受两个输入参数（两个并行流中累加器函数的结果），并执行一些操作（例如合并两个容器）。  
注意事项：  
collect() 方法返回一个容器，其中包含流中所有元素经过处理后的结果。  
supplier 函数负责创建容器，accumulator 函数用于将元素添加到容器中，而 combiner 函数用于在并行流中合并结果。  
如果流为空，则 collect() 方法将返回由 supplier 函数创建的容器，它可能是一个空的容器或者是一个空的对象。

```java
public static void main(String[] args) {
        // 创建一个整数列表
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        // 使用 collect() 将列表中的元素添加到一个 ArrayList 中
        List<Integer> list = numbers.stream()
                                     .collect(ArrayList::new, List::add, List::addAll);

        // 输出结果
        System.out.println(list);
    }
```

## 19. \<R, A\> R collect(Collector\<? super T, A, R\> collector);

它用于将流中的元素收集到一个容器中，这个容器由 Collector 接口定义的三个函数（supplier、accumulator 和 combiner）创建和管理。

方法解释：  
返回类型： R 表示该方法返回一个容器，其中包含流中所有元素经过处理后的结果。  
方法名称： collect 指定了该方法的行为，即将流中的元素收集到由 Collector 接口定义的函数创建的容器中。  
参数： Collector\<? super T, A, R\> collector：一个 Collector 对象，它定义了如何创建容器、如何处理元素以及如何合并并行流中的结果。  
注意事项：  
collect() 方法返回一个容器，其中包含流中所有元素经过处理后的结果。  
Collector 接口定义了三个函数：supplier、accumulator 和 combiner，它们分别用于创建容器、处理元素以及合并并行流中的结果。  
如果流为空，则 collect() 方法将返回由 supplier 函数创建的容器，它可能是一个空的容器或者是一个空的对象。

```java
public static void main(String[] args) {
        // 创建一个整数列表
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        // 使用 collect() 将列表中的元素添加到一个 ArrayList 中
        List<Integer> list = numbers.stream()
                                     .collect(Collectors.toList());

        // 输出结果
        System.out.println(list);
    }
```

## 20. Optional\<T\> min(Comparator\<? super T\> comparator);

它用于找到流中最小的元素。这个操作返回一个 Optional\<T\> 对象，其中包含找到的最小元素，如果流为空，则返回一个空的 Optional。

方法解释：  
返回类型： Optional\<T\> 表示该方法返回一个包含最小元素的 Optional 对象。  
方法名称： min 指定了该方法的行为，即找到流中最小的元素。  
参数： Comparator\<? super T\> comparator：一个比较器，用于比较流中的元素。如果比较器为空，则使用 Comparator.naturalOrder() 作为自然顺序的比较器。  
注意事项：  
如果流为空，则 min() 方法返回一个空的 Optional。  
如果流中有多个元素，则比较器将被用来确定哪个元素是最小的。

```java
public static void main(String[] args) {
        // 创建一个整数列表
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        // 使用 min() 找到列表中最小的元素
        Optional<Integer> smallestNumber = numbers.stream()
                                                    .min(Integer::compareTo);

        // 输出结果
        smallestNumber.ifPresent(System.out::println);
    }
```

## 21. Optional\<T\> max(Comparator\<? super T\> comparator);

它用于找到流中最大的元素。这个操作返回一个 Optional\<T\> 对象，其中包含找到的最大元素，如果流为空，则返回一个空的 Optional。

方法解释：  
返回类型： Optional\<T\> 表示该方法返回一个包含最大元素的 Optional 对象。  
方法名称： max 指定了该方法的行为，即找到流中最大的元素。  
参数： Comparator\<? super T\> comparator：一个比较器，用于比较流中的元素。如果比较器为空，则使用 Comparator.naturalOrder() 作为自然顺序的比较器。  
注意事项：  
如果流为空，则 max() 方法返回一个空的 Optional。  
如果流中有多个元素，则比较器将被用来确定哪个元素是最大的。

```java
public static void main(String[] args) {
        // 创建一个整数列表
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        // 使用 max() 找到列表中最大的元素
        Optional<Integer> largestNumber = numbers.stream()
                                                    .max(Integer::compareTo);

        // 输出结果
        largestNumber.ifPresent(System.out::println);
    }
```

## 22. long count();

它用于计算流中元素的数量。这个操作返回一个 long 类型的值，表示流中元素的数量。

方法解释：  
返回类型： long 表示该方法返回一个长整型值，表示流中元素的数量。  
方法名称： count 指定了该方法的行为，即计算流中元素的数量。  
注意事项：  
count() 方法返回流中元素的数量，包括重复的元素。  
如果流为空，则 count() 方法返回 0。

```java
public static void main(String[] args) {
        // 创建一个整数列表
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        // 使用 count() 计算列表中元素的数量
        long count = numbers.stream()
                              .count();

        // 输出结果
        System.out.println("Count: " + count);
    }
```

## 23. boolean anyMatch(Predicate\<? super T\> predicate);

它用于检查流中的元素是否至少有一个与给定的谓词匹配。这个操作返回一个 boolean 类型的值，表示是否有至少一个元素满足条件。

方法解释：  
返回类型： boolean 表示该方法返回一个布尔值，表示是否有至少一个元素满足条件。  
方法名称： anyMatch 指定了该方法的行为，即检查流中是否有至少一个元素与给定的谓词匹配。  
参数： Predicate\<? super T\> predicate：一个谓词函数，它接受一个类型为 T（或 T 的超类型）的参数，并返回一个布尔值，表示该参数是否满足条件。  
注意事项：  
anyMatch() 方法返回一个布尔值，表示流中是否有至少一个元素与给定的谓词匹配。  
如果流为空，则 anyMatch() 方法返回 false。

```java
public static void main(String[] args) {
        // 创建一个整数列表
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        // 使用 anyMatch() 检查列表中是否至少有一个元素大于 5
        boolean hasAnyNumberGreaterThanFive = numbers.stream()
                                                       .anyMatch(n -> n > 5);

        // 输出结果
        System.out.println("Has any number greater than 5? " + hasAnyNumberGreaterThanFive);
    }
```

## 24. boolean allMatch(Predicate\<? super T\> predicate);

它用于检查流中的元素是否全部与给定的谓词匹配。这个操作返回一个 boolean 类型的值，表示是否所有元素都满足条件。

方法解释：  
返回类型： boolean 表示该方法返回一个布尔值，表示是否所有元素都满足条件。  
方法名称： allMatch 指定了该方法的行为，即检查流中是否所有元素都与给定的谓词匹配。  
参数： Predicate\<? super T\> predicate：一个谓词函数，它接受一个类型为 T（或 T 的超类型）的参数，并返回一个布尔值，表示该参数是否满足条件。  
注意事项：  
allMatch() 方法返回一个布尔值，表示流中是否所有元素都与给定的谓词匹配。  
如果流为空，则 allMatch() 方法返回 true。

```java
public static void main(String[] args) {
        // 创建一个整数列表
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        // 使用 allMatch() 检查列表中是否所有元素都大于 5
        boolean areAllNumbersGreaterThanFive = numbers.stream()
                                                        .allMatch(n -> n > 5);

        // 输出结果
        System.out.println("Are all numbers greater than 5? " + areAllNumbersGreaterThanFive);
    }
```

## 25. boolean noneMatch(Predicate\<? super T\> predicate);

它用于检查流中的元素是否没有一个与给定的谓词匹配。这个操作返回一个 boolean 类型的值，表示是否没有元素满足条件。

方法解释：  
返回类型： boolean 表示该方法返回一个布尔值，表示是否没有元素满足条件。  
方法名称： noneMatch 指定了该方法的行为，即检查流中是否没有一个元素与给定的谓词匹配。  
参数： Predicate\<? super T\> predicate：一个谓词函数，它接受一个类型为 T（或 T 的超类型）的参数，并返回一个布尔值，表示该参数是否满足条件。  
注意事项：  
noneMatch() 方法返回一个布尔值，表示流中是否没有一个元素与给定的谓词匹配。  
如果流为空，则 noneMatch() 方法返回 true。

```java
 public static void main(String[] args) {
        // 创建一个整数列表
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        // 使用 noneMatch() 检查列表中是否没有一个元素大于 5
        boolean hasNoNumberGreaterThanFive = numbers.stream()
                                                      .noneMatch(n -> n > 5);

        // 输出结果
        System.out.println("Has no number greater than 5? " + hasNoNumberGreaterThanFive);
    }
```

## 26. Optional\<T\> findFirst();

它用于找到流中的第一个元素。这个操作返回一个 Optional\<T\> 对象，其中包含找到的第一个元素，如果流为空，则返回一个空的 Optional。

方法解释：  
返回类型： Optional\<T\> 表示该方法返回一个包含第一个元素的 Optional 对象。  
方法名称： findFirst 指定了该方法的行为，即找到流中的第一个元素。  
注意事项：  
如果流为空，则 findFirst() 方法返回一个空的 Optional。  
如果流中有多个元素，则返回的 Optional 对象包含第一个元素。

```java
public static void main(String[] args) {
        // 创建一个整数列表
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        // 使用 findFirst() 找到列表中的第一个元素
        Optional<Integer> firstNumber = numbers.stream()
                                                 .findFirst();

        // 输出结果
        firstNumber.ifPresent(System.out::println);
    }
```

## 27. Optional\<T\> findAny();

它用于找到流中的任意一个元素。这个操作返回一个 Optional\<T\> 对象，其中包含找到的任意一个元素，如果流为空，则返回一个空的 Optional。

方法解释：  
返回类型： Optional\<T\> 表示该方法返回一个包含任意一个元素的 Optional 对象。  
方法名称： findAny 指定了该方法的行为，即找到流中的任意一个元素。  
注意事项：  
如果流为空，则 findAny() 方法返回一个空的 Optional。  
如果流中有多个元素，则返回的 Optional 对象包含流中的一个元素，具体是哪个元素则取决于流处理时的具体实现。

```java
 public static void main(String[] args) {
        // 创建一个整数列表
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        // 使用 findAny() 找到列表中的任意一个元素
        Optional<Integer> anyNumber = numbers.stream()
                                               .findAny();

        // 输出结果
        anyNumber.ifPresent(System.out::println);
    }
```

## 28. public static \<T\> Builder\<T\> builder() {return new Streams.StreamBuilderImpl\<\>();}

用于创建一个 Stream\<T\> 对象。这个接口通常用于创建一个流，然后可以对流进行各种操作，如过滤、映射、归约等。

builder() 方法是一个静态方法，它返回一个 Builder\<T\> 对象的实例。这个实例可以用来构建一个流。Builder\<T\> 接口通常有一个泛型参数 T，表示流中元素的类型。

```java
public static void main(String[] args) {
        // 使用 builder() 方法创建一个 Builder\<T\> 对象
        Builder<Integer> builder = Builder.builder();

        // 使用 builder 对象构建一个流
        Stream<Integer> stream = builder.add(1).add(2).add(3).build();

        // 对流进行操作，例如打印流中的元素
        stream.forEach(System.out::println);
    }
```

## 29. public static \<T\> Stream\<T\> of(T t) {return StreamSupport.stream(new Streams.StreamBuilderImpl\<\>(t), false);}

它用于创建一个只包含单个元素的 Stream\<T\> 对象。这个方法接受一个泛型参数 T，表示流中元素的类型，并返回一个包含该元素的流。

方法解释：  
返回类型： Stream\<T\> 表示该方法返回一个包含单个元素的 Stream\<T\> 对象。  
方法名称： of 指定了该方法的行为，即创建一个包含单个元素的流。  
参数： T t：一个类型为 T 的元素，该元素将被包含在返回的流中。

```java
public static void main(String[] args) {
        // 使用 of() 方法创建一个只包含单个元素的 Stream\<T\> 对象
        Stream<String> singleElementStream = Stream.of("Hello, World!");

        // 对流进行操作，例如打印流中的元素
        singleElementStream.forEach(System.out::println);
    }
```

## 30. public static \<T\> Stream\<T\> of(T... values) {return \Arrays.stream(values);}

它用于创建一个包含多个元素的 Stream\<T\> 对象。这个方法接受一个泛型参数 T，表示流中元素的类型，并接受一个可变参数 values，其中包含多个元素。它返回一个包含这些元素的流。

方法解释：  
返回类型： Stream\<T\> 表示该方法返回一个包含多个元素的 Stream\<T\> 对象。  
方法名称： of 指定了该方法的行为，即创建一个包含多个元素的流。  
参数： T... values：一个可变参数，它包含多个类型为 T 的元素，这些元素将被包含在返回的流中。

```java
public static void main(String[] args) {
        // 使用 of() 方法创建一个包含多个元素的 Stream\<T\> 对象
        Stream<String> multipleElementStream = Stream.of("Hello", "World", "Java");

        // 对流进行操作，例如打印流中的元素
        multipleElementStream.forEach(System.out::println);
    }
```

## 31. public static \<T\> Stream\<T\> iterate(final T seed, final UnaryOperator\<T\> f)

它用于创建一个无限循环的 Stream\<T\> 对象。这个方法接受两个泛型参数：seed 是循环的起始值，f 是一个一元操作符，它定义了如何生成下一个值。

方法解释：  
返回类型： Stream\<T\> 表示该方法返回一个包含无限多个元素的 Stream\<T\> 对象。  
方法名称： iterate 指定了该方法的行为，即创建一个无限循环的流。  
参数：  
final T seed：循环的起始值，也是流中的第一个元素。  
final UnaryOperator\<T\> f：一个一元操作符，它接受当前元素作为输入，并返回下一个元素。这个操作符定义了流中元素如何生成。

```java
public static void main(String[] args) {
        // 使用 iterate() 方法创建一个无限循环的 Stream\<T\> 对象
        Stream<Integer> infiniteStream = Stream.iterate(0, n -> n + 1);

        // 对流进行操作，例如打印流中的前10个元素
        infiniteStream.limit(10).forEach(System.out::println);
    }
// 我们使用 iterate(0, n -> n + 1) 方法创建了一个无限循环的 Stream<Integer> 对象，其中起始值是 0，每个元素是前一个元素加 1。然后，我们使用 limit(10) 方法限制流中只包含前 10 个元素，并使用 forEach 方法来打印这些元素。
```

## 32. public static \<T\> Stream\<T\> generate(Supplier\<T\> s)

它用于创建一个无限生成的 Stream\<T\> 对象。这个方法接受一个泛型参数 T，表示流中元素的类型，并接受一个 Supplier\<T\> 接口的实现作为参数，该接口定义了如何生成流中的下一个元素。

方法解释：  
返回类型： Stream\<T\> 表示该方法返回一个包含无限多个元素的 Stream\<T\> 对象。  
方法名称： generate 指定了该方法的行为，即创建一个无限生成的流。  
参数： Supplier\<T\> s：一个 Supplier\<T\> 接口的实现，它定义了如何生成流中的下一个元素。这个实现类需要提供一个无参数的 get() 方法，该方法返回下一个元素。

```java
public static void main(String[] args) {
        // 使用 generate() 方法创建一个无限生成的 Stream\<T\> 对象
        Stream<Integer> infiniteGenerationStream = Stream.generate(new Supplier<Integer>() {
            private int count = 0;
            @Override
            public Integer get() {
                return count++;
            }
        });

        // 对流进行操作，例如打印流中的前10个元素
        infiniteGenerationStream.limit(10).forEach(System.out::println);
    }
```

## 33. public static \<T\> Stream\<T\> concat(Stream\<? extends T\> a, Stream\<? extends T\> b)

它用于将两个 Stream\<? extends T\> 对象连接起来，创建一个新的 Stream\<T\> 对象。这个方法接受两个泛型参数：a 和 b，分别代表两个流的类型，并返回一个包含两个流中所有元素的新的流。

方法解释：  
返回类型： Stream\<T\> 表示该方法返回一个包含两个流中所有元素的新的流。  
方法名称： concat 指定了该方法的行为，即将两个流连接起来。  
参数：  
Stream\<? extends T\> a：第一个流，其元素类型为 T 或 T 的超类型。  
Stream\<? extends T\> b：第二个流，其元素类型为 T 或 T 的超类型。

```java
public static void main(String[] args) {
        // 创建两个流
        Stream<String> streamA = Stream.of("A", "B", "C");
        Stream<String> streamB = Stream.of("D", "E", "F");

        // 使用 concat() 方法将两个流连接起来
        Stream<String> concatenatedStream = Stream.concat(streamA, streamB);

        // 对连接后的流进行操作，例如打印流中的元素
        concatenatedStream.forEach(System.out::println);
    }
```

