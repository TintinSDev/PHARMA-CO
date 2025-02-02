"""Description of changes

Revision ID: 043d1bddaf41
Revises: 
Create Date: 2025-02-01 22:38:56.831418

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '043d1bddaf41'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_patients_first_name', table_name='patients')
    op.drop_index('ix_patients_id', table_name='patients')
    op.drop_index('ix_patients_last_name', table_name='patients')
    op.drop_index('ix_patients_middle_name', table_name='patients')
    op.drop_table('patients')
    op.drop_index('ix_collections_id', table_name='collections')
    op.drop_table('collections')
    op.drop_index('ix_regimens_id', table_name='regimens')
    op.drop_index('ix_regimens_name', table_name='regimens')
    op.drop_table('regimens')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('regimens',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('name', sa.VARCHAR(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_regimens_name', 'regimens', ['name'], unique=False)
    op.create_index('ix_regimens_id', 'regimens', ['id'], unique=False)
    op.create_table('collections',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('patient_id', sa.INTEGER(), nullable=True),
    sa.Column('regimen', sa.VARCHAR(), nullable=True),
    sa.Column('quantity', sa.INTEGER(), nullable=True),
    sa.Column('collection_date', sa.DATE(), nullable=True),
    sa.Column('next_collection_date', sa.DATE(), nullable=True),
    sa.Column('overdue_date', sa.DATE(), nullable=True),
    sa.CheckConstraint('quantity <= 180'),
    sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_collections_id', 'collections', ['id'], unique=False)
    op.create_table('patients',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('first_name', sa.VARCHAR(), nullable=True),
    sa.Column('middle_name', sa.VARCHAR(), nullable=True),
    sa.Column('last_name', sa.VARCHAR(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_patients_middle_name', 'patients', ['middle_name'], unique=False)
    op.create_index('ix_patients_last_name', 'patients', ['last_name'], unique=False)
    op.create_index('ix_patients_id', 'patients', ['id'], unique=False)
    op.create_index('ix_patients_first_name', 'patients', ['first_name'], unique=False)
    # ### end Alembic commands ###
