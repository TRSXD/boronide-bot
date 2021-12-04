local a, b = 'hello world!', 10.1005
print(a, nil)
local function a()
    print(a, nil)
    local b, c = nil, 105.2

    print(b, c)
    print("gey")
end
a()