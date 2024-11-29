# 记录springboot中cucumber使用mock
1.cucumber相关用例，步骤，runnerTest等编写不变
2.mock使用的是mockito-core-1.10.19
3.本文记录的是对mapper进行mock
4.只需在step中进mock编写就可以 
```java
public class MyTestStep {
	@Mock
	private MyTestMapper myTestMapper;
	@Autowired
	private MyTestService myTestService;

	@Before
	public void setUp(){
		myTestMapper = Mockito.mock(MyTestMapper.class);
	}
	@假如("输入查询请求")
	public void query(String reqest) {
		MyTest test = new MyTest();
		test.setName("test");
		test.setAge(18);
		Mockito.when(myTestMapper.queryByName("test")).thenReturn(test);
		/**
		 * 如果方法需要传入的是一个对象，可以使用Mockito.any(MyTest.class)就可以返回特定的结果
		 */
		// Mockito.when(myTestMapper.updateMyTest(Mockito.any(MyTest.class))).thenReturn(test);
		/**
		 * 将mock后的mapper手动注入到service中，第三个参数必须与service中注入时mapper的变量名一致
		 */

		ReflectionTestUtils.setField(myTestService，"myTestMapper", myTestMapper);
		后续步骤........
	}
}
```