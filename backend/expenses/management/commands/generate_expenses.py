import random
from faker import Faker
from django.core.management.base import BaseCommand
from expenses.models import User, Category, Expense

class Command(BaseCommand):
    help = 'Generate random expenses data'

    def handle(self, *args, **kwargs):
        faker = Faker()
        
        # Ensure you have some users and categories already created
        users = User.objects.all()
        categories = Category.objects.all()

        if not users.exists():
            self.stdout.write(self.style.ERROR('No users found. Please create some users first.'))
            return

        if not categories.exists():
            self.stdout.write(self.style.ERROR('No categories found. Please create some categories first.'))
            return

        for _ in range(20):  # Adjust the range for the number of records you want to create
            user = random.choice(users)
            category = random.choice(categories)
            amount = round(random.uniform(10.0, 1000.0), 2)
            date = faker.date_between(start_date='-1y', end_date='today')
            description = faker.sentence()

            Expense.objects.create(
                username=user,
                amount=amount,
                date=date,
                category=category,
                description=description
            )

        self.stdout.write(self.style.SUCCESS('Successfully generated random expenses data'))


# cmd = python manage.py generate_expenses
