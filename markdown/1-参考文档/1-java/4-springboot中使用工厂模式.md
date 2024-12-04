# springboot中使用工厂模式
## 工厂类

```java
@Service
public class TestFactory {
	/**
	 * 	初始化时可以自动将TestInterface加入到map中，
	 *  key为实现TestInterface类@Component("test1")指定的值
	 *  value为实现TestInterface类
	 *  Map<"test1",TestImpl1>
	 */
	@Autowired
	private Map<String, TestInterface> map = new ConcurrentHashMap<String, TestInterface>();
	
	public TestInterface geTestInterface(String key) {
		System.out.println(key);
		return map.get(key);
	}
}
```
## 接口类

```java
public interface TestInterface {
	public String getMsg(String msg);
}
```
## 接口实现类

```java
@Component("test1")
public class TestImpl1 implements TestInterface{

	@Override
	public String getMsg(String msg) {
		return "test1:"+msg;
	}

}
```
```java
@Component("test2")
public class TestImpl2 implements TestInterface{

	@Override
	public String getMsg(String msg) {
		return "test2:"+msg;
	}

}
```
```java
@Component("test3")
public class TestImpl3 implements TestInterface{

	@Override
	public String getMsg(String msg) {
		return "test3:"+msg;
	}

}
```
## controller类

```java
@RestController(value = "/")
public class TestController {
	@Autowired
	private TestFactory testFactory;
	
	@RequestMapping(value = "msg/{key}",method = RequestMethod.GET)
	public String getMsg(@PathVariable("key")String key) {
		TestInterface test = testFactory.geTestInterface(key);
		return test.getMsg("test test");
	}
}
```
