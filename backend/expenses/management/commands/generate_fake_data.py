from django.core.management.base import BaseCommand
from faker import Faker
from expenses.models import Category, Expense, User
import random

class Command(BaseCommand):
    help = 'Generate fake categories and expenses'

    def handle(self, *args, **kwargs):
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
                self.stdout.write(self.style.WARNING("Please make sure you have some users and categories."))
                return

            for _ in range(num_expenses):
                Expense.objects.create(
                    username=random.choice(users),
                    amount=fake.random_number(digits=5),
                    date=fake.date_this_year(),
                    category=random.choice(categories),
                    description=fake.text()
                )

        # Parameters for data generation
        num_categories = 7
        num_expenses = 90

        # Generate the data
        create_fake_categories(num_categories)
        create_fake_expenses(num_expenses)

        self.stdout.write(self.style.SUCCESS('Successfully generated fake data'))
