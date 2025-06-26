import json

res = []
with open("ingredients.json", "r") as file:
    content = json.load(file)

for recipe in content:
    for i in recipe["ingredients"]:
        res.append(i)

with open("formatted_ingredients.json","w") as file:
    json.dump(res, file)
print(res)