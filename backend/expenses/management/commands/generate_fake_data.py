from faker import Faker
from expenses.models import Category, Expense, User
import random
import django
import os

# Set up Django settings and environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "yourproject.settings")
django.setup()

fake = Faker()

def create_fake_categories(num_categories):
    for _ in range(num_categories):
        Category.objects.create(
            name=fake.word(),
            description=fake.text()
        )

def create_fake_expenses(num_expenses):
    users = User.objects.all()
    categories = Category.objects.all()

    if not users or not categories:
        print("Please make sure you have some users and categories.")
        return

    for _ in range(num_expenses):
        Expense.objects.create(
            username=random.choice(users),
            amount=fake.random_number(digits=5),
            date=fake.date_this_year(),
            category=random.choice(categories),
            description=fake.text()
        )

if __name__ == "__main__":
    num_categories = 10
    num_expenses = 50

    create_fake_categories(num_categories)
    create_fake_expenses(num_expenses)
