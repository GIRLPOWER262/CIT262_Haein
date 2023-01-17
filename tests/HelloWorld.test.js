import HelloWorld from '../utils/HelloWorld';


it ("Should return 'Hello Haein'", ()=>{
    
    const result = HelloWorld();

    expect(result).toBe("Hello Haein");
});