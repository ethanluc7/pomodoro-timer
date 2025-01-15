"""removed username

Revision ID: 60813ffea24e
Revises: e7d62f3b4e1f
Create Date: 2025-01-13 18:35:57.686521

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '60813ffea24e'
down_revision = 'e7d62f3b4e1f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_constraint('user_username_key', type_='unique')
        batch_op.drop_column('username')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('username', sa.VARCHAR(length=50), autoincrement=False, nullable=False))
        batch_op.create_unique_constraint('user_username_key', ['username'])

    # ### end Alembic commands ###
