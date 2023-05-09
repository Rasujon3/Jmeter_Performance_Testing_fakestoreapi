# Jmeter_Performance_Testing_fakestoreapi
Dear, 

I’ve completed performance test on frequently used API for test App https://fakestoreapi.com. <br/>
Test executed for the below mentioned scenario in server https://fakestoreapi.com. 

* 10 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 4.4 And Total Concurrent API requested: 290.
* 50 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 23 And Total Concurrent API requested: 1450.
* 100 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 35 And Total Concurrent API requested: 2900.
```diff
- While executed 100 concurrent request, found 1 request got connection timeout and error rate is 0.03%.
```
<b>Summary:</b> Server can handle almost concurrent <b>2950</b> API call with almost zero (0) error rate.

Report Image:
![report_img](https://github.com/Rasujon3/Jmeter_Performance_Testing_fakestoreapi/assets/61946723/e637af14-d0f7-480d-bf2c-ebaaf8fab2a1)
