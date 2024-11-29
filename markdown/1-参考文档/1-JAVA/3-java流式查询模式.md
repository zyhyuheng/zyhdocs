[TOC]
# java流式查询模式
## 一、流式查询模式简介
流式查询模式是一种优化查询的方法，可以在查询大量数据时降低内存占用，提高查询速度。在流式查询模式下，查询结果是逐条从数据库服务器流式传输到客户端，而不是一次性将所有查询结果加载到内存中。
## 二、JDBC流式查询模式

 1. 创建 PreparedStatement 对象时，需要设置 ResultSet 类型为 TYPE_FORWARD_ONLY，设置 ResultSet 并发模式为 CONCUR_READ_ONLY：
 

```java
PreparedStatement pstmt = conn.prepareStatement(sql, ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY);

```

 2. 通过 setFetchSize() 方法设置每次从数据库中获取的记录数：
 

```java
pstmt.setFetchSize(fetchSize);

```

 3. 执行查询语句后，通过 ResultSet 对象的 next() 方法逐条获取查询结果：
 

```java
ResultSet rs = pstmt.executeQuery();
while (rs.next()) {
    // 处理查询结果
}

```
需要注意的是，在使用流式查询模式时，ResultSet 对象的一些方法可能会失效，比如 absolute()、last()、previous()、beforeFirst() 等方法。此外，流式查询模式只适用于查询，不适用于更新、插入、删除等操作。
## 三、mybatis使用流式查询模式

 1. 在 MyBatis 中，可以通过设置 fetchSize 属性来启用流式查询模式，示例如下：
 

```java
<select id="selectLargeData" resultType="com.example.LargeData" fetchSize="100">
    select * from large_data_table
</select>

```

 2. 在以上示例中，fetchSize 属性设置为 100，表示每次从数据库中获取 100 条记录，从而实现流式查询。在执行查询操作时，需要通过 while 循环逐条处理查询结果，示例如下：
 

```java
SqlSession sqlSession = sqlSessionFactory.openSession();
try {
    List<LargeData> largeDataList = new ArrayList<>();
    try (Cursor<LargeData> cursor = sqlSession.selectCursor("selectLargeData")) {
        while (cursor.hasNext()) {
            LargeData largeData = cursor.next();
            largeDataList.add(largeData);
        }
    }
} finally {
    sqlSession.close();
}

```
以上示例中，使用了 MyBatis 提供的 Cursor 接口，可以通过 hasNext() 和 next() 方法逐条获取查询结果，从而实现流式处理。

需要注意的是，流式查询模式需要考虑数据库连接的资源占用，因此在使用完毕后需要及时关闭数据库连接。此外，在处理大数据量时，也需要考虑内存占用问题，可以使用分页查询等方法来控制数据量大小。
## 四、springboot+mybatis使用流式查询模式
1.配置数据源
首先需要在 application.properties 文件中配置数据源，示例如下：

```java
spring.datasource.url=jdbc:mysql://localhost:3306/test
spring.datasource.username=root
spring.datasource.password=123456
```
这里以 MySQL 数据库为例，使用 com.mysql.cj.jdbc.Driver 作为驱动程序。

2.配置 MyBatis
在 application.properties 文件中配置 MyBatis 相关属性，示例如下：

```java
mybatis.mapper-locations=classpath:mapper/*.xml
mybatis.configuration.map-underscore-to-camel-case=true
mybatis.configuration.default-fetch-size=100
```
其中，mapper-locations 属性配置了 MyBatis Mapper 的 XML 文件路径，map-underscore-to-camel-case 属性指定了开启驼峰命名规则，default-fetch-size 属性指定了默认的 fetchSize。

3.创建 Mapper
创建 MyBatis Mapper 接口，并在 XML 文件中配置查询语句，示例如下：

```java
public interface LargeDataMapper {
    @Select("select * from large_data_table")
    @ResultType(LargeData.class)
    Cursor<LargeData> selectLargeData();
}
```
在以上示例中，使用了 MyBatis 提供的 @Select 和 @ResultType 注解，指定了查询语句和返回类型。此外，还使用了 Cursor 接口来实现流式查询。

4.查询数据
在 Service 层中调用 Mapper 方法，并使用 while 循环逐条处理查询结果，示例如下：

```java
@Service
public class LargeDataService {
    @Autowired
    private LargeDataMapper largeDataMapper;
    
    public List<LargeData> selectLargeData() {
        try (Cursor<LargeData> cursor = largeDataMapper.selectLargeData()) {
            List<LargeData> largeDataList = new ArrayList<>();
            while (cursor.hasNext()) {
                LargeData largeData = cursor.next();
                largeDataList.add(largeData);
            }
            return largeDataList;
        }
    }
}
```
在以上示例中，使用了 try-with-resources 语句来确保资源及时关闭。同时，在 while 循环中逐条处理查询结果，并将结果添加到 List 中返回。

总的来说，使用 Spring Boot 和 MyBatis 实现流式查询模式比较简单，只需要在配置文件中设置 fetchSize 属性和默认的 fetchSize，然后在 Mapper 接口中使用 Cursor 接口实现流式查询，即可避免内存溢出和提高查询速度。
## 五、springboot jpa流式查询模式
首先，我们需要创建一个实体类 User，用于表示用户信息：

```java
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Integer age;

    // 省略 getter 和 setter 方法
}
```
然后，我们需要创建一个 UserRepository 接口，用于定义查询方法：

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u")
    Stream<User> findAllByStream();

}
```
在上面的代码中，我们使用 @Query 注解定义了一个查询语句，该语句返回一个 Stream\<User\> 对象，该对象包含所有用户。

接下来，我们需要编写一个 UserService 类，用于调用 UserRepository 中的方法：

```java
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public void findAllUsersByStream() {
        try (Stream<User> stream = userRepository.findAllByStream()) {
            stream.forEach(user -> {
                // 处理用户数据
                System.out.println(user);
            });
        }
    }

}
```

在上面的代码中，我们注入了 UserRepository 对象，并且定义了一个 findAllUsersByStream 方法，该方法使用 @Transactional 注解将方法声明为只读事务。

在方法中，我们使用 try-with-resources 语句来获取一个 Stream\<User\> 对象，并使用 forEach 方法遍历所有用户数据。由于使用了 try-with-resources 语句，所以当处理完用户数据后，stream 对象会自动关闭。

最后，我们可以在应用程序的入口类中调用 UserService 中的方法：

```java
@SpringBootApplication
public class Application implements CommandLineRunner {

    @Autowired
    private UserService userService;

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        userService.findAllUsersByStream();
    }

}
```
在上面的代码中，我们注入了 UserService 对象，并在 run 方法中调用了 findAllUsersByStream 方法。
## 注：流式查询模式速度会不会比较慢(查询到的信息)
流式查询模式并不一定比非流式查询模式慢，其查询速度主要取决于数据访问方式和网络传输速度等因素。

流式查询模式的优点是可以避免将大量数据一次性加载到内存中，降低了内存占用，尤其是在处理大数据量时可以明显提高程序性能。此外，流式查询模式还可以更快地获取第一条数据，因为数据是逐条传输的。

但是，流式查询模式的缺点是每次从数据库获取数据的时间较长，因为数据是逐条传输的。此外，流式查询模式可能会增加数据库服务器的负载，因为服务器需要不断发送数据到客户端。

综上所述，流式查询模式的使用要根据具体情况来决定，需要考虑数据量大小、网络传输速度、查询方式等因素。对于大数据量的查询操作，流式查询模式往往是更优的选择，可以显著提高程序性能。